import { Module, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import {User} from './user.entity'
import { AuthService } from "./auth.service";
import { CurreUserMiddleware } from "./middlewares/current-user.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers:[UsersController],
    providers:[
        UserService, 
        AuthService
    ]
})
export class UsersModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(CurreUserMiddleware).forRoutes('*')
  }
}