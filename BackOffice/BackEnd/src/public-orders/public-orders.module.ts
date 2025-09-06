import { Module } from '@nestjs/common';
import { PublicOrdersController } from './public-orders.controller';
import { OrdersModule } from '../orders/orders.module';
import { SupabaseStorageService } from '../storage/supabase-storage.service';

@Module({
  imports: [OrdersModule],
  controllers: [PublicOrdersController],
  providers: [SupabaseStorageService],
})
export class PublicOrdersModule {}
