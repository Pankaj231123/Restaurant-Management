import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',  
    }),

    TypeOrmModule.forRoot(typeOrmConfig),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN', '1d');

        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not set in the environment');
        }

        console.log('JWT_SECRET loaded');
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiresIn },
        };
      },
    }),

    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get<string>('MAIL_USER');
        const pass = configService.get<string>('MAIL_PASS');

        if (!user || !pass) {
          throw new Error('MAIL_USER or MAIL_PASS is not set in the environment');
        }

        console.log('MAIL_USER and MAIL_PASS loaded');

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
          },
          defaults: { from: `"No Reply" <${user}>` },
        };
      },
    }),

    UsersModule,
    MenuModule,
    OrderModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}
