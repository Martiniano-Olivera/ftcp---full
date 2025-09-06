import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { randomUUID } from 'crypto';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';

@Controller('public/orders')
export class PublicOrdersController {
  constructor(
    private readonly storageService: SupabaseStorageService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePublicOrderDto,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Se requiere al menos un archivo');
    }
    const invalid = files.find(f => f.mimetype !== 'application/pdf');
    if (invalid) {
      throw new BadRequestException('Solo se permiten archivos PDF');
    }
    await this.storageService.ensureBucket('orders');
    const uploads = await Promise.all(
      files.map(async file => {
        const now = new Date();
        const folder = `${now.getFullYear()}/${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
        const path = `${folder}/${randomUUID()}/${file.originalname}`;
        const { url } = await this.storageService.uploadFile(file, path);
        return { nombre: file.originalname, url };
      }),
    );
    const order = await this.ordersService.createOrder({
      clienteNombre: body.clienteNombre,
      clienteTelefono: body.clienteTelefono,
      archivos: uploads,
      paid: false,
    });
    return order;
  }
}
