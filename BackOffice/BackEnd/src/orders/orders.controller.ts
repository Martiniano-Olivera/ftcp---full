import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { randomUUID } from 'crypto';
import { SupabaseStorageService } from '../storage/supabase-storage.service';

@ApiTags('Pedidos')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', undefined, { storage: memoryStorage() }),
  )
  @ApiOperation({ summary: 'Subir archivos a Supabase Storage' })
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploads = await Promise.all(
      files.map(async file => {
        const now = new Date();
        const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const filename = `${randomUUID()}-${file.originalname}`;
        const path = `orders/${folder}/${filename}`;
        const { url } = await this.storageService.uploadFile(
          file,
          path,
          'orders',
        );

        // TODO: usar createSignedUrl si el bucket es privado
        return { nombre: file.originalname, path, url };
      }),
    );
    return uploads;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido creado exitosamente',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos pendientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos pendientes',
    type: [Order],
  })
  async getPendingOrders(): Promise<Order[]> {
    return await this.ordersService.getPendingOrders();
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de pedidos',
    type: [Order],
  })
  async getAllOrders(): Promise<Order[]> {
    return await this.ordersService.getAllOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado', type: Order })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.getOrderById(id);
  }

  @Patch(':id/ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar pedido como listo' })
  @ApiResponse({
    status: 200,
    description: 'Pedido marcado como listo',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async markOrderAsReady(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.markOrderAsReady(id);
  }

  @Get(':id/whatsapp-link')
  @ApiOperation({ summary: 'Generar link preformateado de WhatsApp' })
  @ApiResponse({ status: 200, description: 'Link de WhatsApp generado' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async generateWhatsAppLink(
    @Param('id') id: string,
    @Query('phone') phone?: string,
  ): Promise<{ link: string }> {
    const link = await this.ordersService.generateWhatsAppLink(id, phone);
    return { link };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido actualizado exitosamente',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiResponse({ status: 204, description: 'Pedido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    await this.ordersService.deleteOrder(id);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Obtener estadísticas de pedidos' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas' })
  async getOrderStats() {
    return await this.ordersService.getOrderStats();
  }
}
