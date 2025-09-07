// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Post,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
// import { randomUUID } from 'crypto';
// import { SupabaseStorageService } from '../storage/supabase-storage.service';
// import { OrdersService } from '../orders/orders.service';
// import { CreatePublicOrderDto } from './dto/create-public-order.dto';

// @Controller('public/orders')
// export class PublicOrdersController {
//   constructor(
//     private readonly ordersService: OrdersService,
//     private readonly storageService: SupabaseStorageService,
//   ) {}

//   @Post()
//   @UseInterceptors(
//     FilesInterceptor('files', 10, {
//       storage: memoryStorage(),
//       limits: { fileSize: 15 * 1024 * 1024 },
//     }),
//   )
//   async create(
//     @Body() body: CreatePublicOrderDto,
//     @UploadedFiles() files: Express.Multer.File[],
//   ) {
//     if (!files || files.length === 0) {
//       throw new BadRequestException('Se requieren archivos');
//     }
//     const invalid = files.find(f => f.mimetype !== 'application/pdf');
//     if (invalid) {
//       throw new BadRequestException('Solo se permiten archivos PDF');
//     }

//     await this.storageService.ensureBucket('orders');
//     const archivos = await Promise.all(
//       files.map(async file => {
//         const now = new Date();
//         const folder = `${now.getFullYear()}/${String(
//           now.getMonth() + 1,
//         ).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
//         const path = `${folder}/${randomUUID()}/${file.originalname}`;
//         const { url } = await this.storageService.uploadFile(file, path);
//         return { nombre: file.originalname, url };
//       }),
//     );

//     return this.ordersService.createOrder({
//       clienteNombre: body.clienteNombre,
//       clienteTelefono: body.clienteTelefono,
//       archivos,
//       paid: false,
//     });
//   }
// }
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { OrdersService } from '../orders/orders.service';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { randomUUID } from 'crypto';

@Controller('public/orders')
export class PublicOrdersController {
  constructor(
    private readonly orders: OrdersService,
    private readonly storage: SupabaseStorageService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB por archivo
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('clienteNombre') clienteNombre: string,
    @Body('clienteTelefono') clienteTelefono: string,
  ) {
    if (!clienteNombre || !clienteTelefono)
      throw new BadRequestException(
        'clienteNombre y clienteTelefono son requeridos',
      );
    if (!files?.length) throw new BadRequestException('Subí al menos un PDF');

    const pdfs = files.filter(f => f.mimetype === 'application/pdf');
    if (pdfs.length !== files.length)
      throw new BadRequestException('Solo se permiten archivos PDF');

    const y = new Date().getUTCFullYear();
    const m = String(new Date().getUTCMonth() + 1).padStart(2, '0');
    const d = String(new Date().getUTCDate()).padStart(2, '0');

    const uploaded: { nombre: string; url: string }[] = [];
    for (const file of pdfs) {
      const path = `${y}/${m}/${d}/${randomUUID()}/${file.originalname}`;
      const { url } = await this.storage.uploadFile(file, path, 'orders');
      uploaded.push({ nombre: file.originalname, url });
    }

    return this.orders.createOrder({
      clienteNombre,
      clienteTelefono,
      archivos: uploaded,
      paid: false,
    });
  }
}
