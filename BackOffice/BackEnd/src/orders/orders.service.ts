import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Crear un nuevo pedido
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      archivos: createOrderDto.archivos?.map((a) => ({
        nombre: a.nombre,
        urlDrive: a.url,
      })),
    });
    return await this.orderRepository.save(order);
  }

  // Obtener todos los pedidos pendientes
  async getPendingOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { estado: OrderStatus.PENDIENTE },
      order: { createdAt: 'ASC' },
    });
  }

  // Obtener todos los pedidos
  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener un pedido por ID
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return order;
  }

  // Marcar pedido como listo
  async markOrderAsReady(id: string): Promise<Order> {
    const order = await this.getOrderById(id);
    order.estado = OrderStatus.LISTO;
    return await this.orderRepository.save(order);
  }

  // Generar link de WhatsApp para un pedido
  async generateWhatsAppLink(orderId: string, phone?: string): Promise<string> {
    const order = await this.getOrderById(orderId);
    const fileUrl = order.archivos?.[0]?.urlDrive || '';
    const message = `Hola ${order.clienteNombre}! Tu pedido está listo para retirar. Detalle: ${fileUrl}. ¡Gracias!`;
    const encodedMessage = encodeURIComponent(message);
    const telefono = phone || order.clienteTelefono;
    return `https://wa.me/${telefono}?text=${encodedMessage}`;
  }

  // Actualizar un pedido
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  // Eliminar un pedido
  async deleteOrder(id: string): Promise<void> {
    const order = await this.getOrderById(id);
    await this.orderRepository.remove(order);
  }

  // Obtener estadísticas básicas
  async getOrderStats() {
    const [total, pendientes, listos] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { estado: OrderStatus.PENDIENTE } }),
      this.orderRepository.count({ where: { estado: OrderStatus.LISTO } }),
    ]);

    return {
      total,
      pendientes,
      listos,
    };
  }
}
