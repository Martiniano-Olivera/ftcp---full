import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';

@Controller('public/orders')
export class PublicOrdersController {
  constructor(
    private readonly storage: SupabaseStorageService,
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
    if (!body.clienteNombre || !body.clienteTelefono) {
      throw new BadRequestException('Nombre y teléfono son requeridos');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('Debe adjuntar al menos un archivo');
    }
    const invalid = files.find((f) => f.mimetype !== 'application/pdf');
    if (invalid) {
      throw new BadRequestException('Solo se aceptan archivos PDF');
    }

    await this.storage.ensureBucket('orders');
    const today = new Date();
    const prefix = `${today.getFullYear()}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today
      .getDate()
      .toString()
      .padStart(2, '0')}/${uuidv4()}`;

    const archivos = [];
    for (const file of files) {
      const path = `${prefix}/${file.originalname}`;
      const { url } = await this.storage.uploadFile(file, path);
      archivos.push({ nombre: file.originalname, url });
    }

    const order = await this.ordersService.createOrder({
      clienteNombre: body.clienteNombre,
      clienteTelefono: body.clienteTelefono,
      archivos,
      paid: false,
    });

    return order;
  }
}
