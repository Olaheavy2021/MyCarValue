import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import {User} from './user.entity'
import { AuthService } from "./auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers:[UsersController],
    providers:[UserService, AuthService]
})
export class UsersModule{}