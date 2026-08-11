import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { SalesChallan } from './entities/sales-challan.entity';
import { ChallanItem } from './entities/challan-item.entity';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { SalesChallanModule } from './sales-challan/sales-challan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        entities: [
          User,
          Customer,
          Product,
          StockMovement,
          SalesChallan,
          ChallanItem,
        ],

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,

    CustomerModule,

    ProductModule,

    StockMovementModule,

    SalesChallanModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}