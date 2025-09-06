import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicOrdersController } from './public-orders.controller';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/entities/order.entity';
import { SupabaseStorageService } from '../storage/supabase-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PublicOrdersController],
  providers: [OrdersService, SupabaseStorageService],
})
export class PublicOrdersModule {}
