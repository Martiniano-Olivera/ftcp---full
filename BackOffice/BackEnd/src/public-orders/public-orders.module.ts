import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { PublicOrdersController } from './public-orders.controller';

@Module({
  imports: [OrdersModule],
  controllers: [PublicOrdersController],
  providers: [SupabaseStorageService],
})
export class PublicOrdersModule {}
