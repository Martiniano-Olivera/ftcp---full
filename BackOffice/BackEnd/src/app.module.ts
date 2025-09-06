import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { EmployeesModule } from './employees/employees.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PublicOrdersModule } from './public-orders/public-orders.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: true,
        extra: { ssl: { rejectUnauthorized: false } },
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    OrdersModule,
    EmployeesModule,
    AuthModule,
    HealthModule,
    PublicOrdersModule,
  ],
})
export class AppModule {}
