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
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { Express } from 'express';

@ApiTags('Pedidos')
@Controller('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file', 20, {
    storage: multer.memoryStorage(),
  }))
  @ApiOperation({ summary: 'Subir archivos a Supabase' })
  @ApiResponse({ status: 200, description: 'Archivos subidos' })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ nombre: string; path: string; url: string }[]> {
    const results = await Promise.all(
      files.map(async (file) => {
        const path = await this.storageService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
        );
        // TODO: usar signed URL si el bucket es privado
        const url = this.storageService.getPublicUrl(path);
        return { nombre: file.originalname, path, url };
      }),
    );
    return results;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente', type: Order })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los pedidos pendientes' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos pendientes', type: [Order] })
  async getPendingOrders(): Promise<Order[]> {
    return await this.ordersService.getPendingOrders();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({ status: 200, description: 'Lista completa de pedidos', type: [Order] })
  async getAllOrders(): Promise<Order[]> {
    return await this.ordersService.getAllOrders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado', type: Order })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.getOrderById(id);
  }

  @Patch(':id/ready')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar pedido como listo' })
  @ApiResponse({ status: 200, description: 'Pedido marcado como listo', type: Order })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async markOrderAsReady(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.markOrderAsReady(id);
  }

  @Get(':id/whatsapp-link')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un pedido' })
  @ApiResponse({ status: 200, description: 'Pedido actualizado exitosamente', type: Order })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiResponse({ status: 204, description: 'Pedido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    await this.ordersService.deleteOrder(id);
  }

  @Get('stats/summary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener estadísticas de pedidos' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas' })
  async getOrderStats() {
    return await this.ordersService.getOrderStats();
  }
}
