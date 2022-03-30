import { User } from 'src/users/user.entity';
import { Report } from 'src/reports/report.entity';
import { UserService } from './../users.service';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurreUserMiddleware implements NestMiddleware{
    constructor(private usersService: UserService){}
    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {};

        if(userId){
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }
        next();
    }
}