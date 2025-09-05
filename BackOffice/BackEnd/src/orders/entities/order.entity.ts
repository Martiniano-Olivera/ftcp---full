import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// DTO para archivos del pedido
export class OrderFile {
  @ApiProperty({ description: 'Nombre del archivo' })
  nombre: string;

  @ApiProperty({ description: 'URL del archivo' })
  url: string;
}

// Enum para estados del pedido
export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  LISTO = 'LISTO',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'ID único del pedido' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del cliente' })
  @Column({ type: 'varchar', length: 255 })
  clienteNombre: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @Column({ type: 'varchar', length: 20 })
  clienteTelefono: string;

  @ApiProperty({ description: 'Archivos del pedido', type: [OrderFile] })
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  archivos: OrderFile[];

  @ApiProperty({ description: 'Estado del pedido', enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status_enum',
    default: OrderStatus.PENDIENTE,
  })
  estado: OrderStatus;

  @ApiProperty({ description: 'Indica si el pedido está pagado' })
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @ApiProperty({ description: 'Fecha de creación del pedido' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
