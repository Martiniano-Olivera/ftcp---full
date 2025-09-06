import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePublicOrderDto,
  ) {
    const { clienteNombre, clienteTelefono } = body;
    if (!clienteNombre || !clienteTelefono) {
      throw new BadRequestException('Datos incompletos');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No se subieron archivos');
    }

    // Validar mimetype
    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Solo se permiten archivos PDF');
      }
    }

    await this.storageService.ensureBucket('orders');
    const uploaded = [];
    for (const file of files) {
      const now = new Date();
      const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${randomUUID()}/${file.originalname}`;
      const { url } = await this.storageService.uploadFile(file, path);
      uploaded.push({ nombre: file.originalname, url });
    }

    const order = await this.ordersService.createOrder({
      clienteNombre,
      clienteTelefono,
      archivos: uploaded,
      paid: false,
    });

    return order;
  }
}
