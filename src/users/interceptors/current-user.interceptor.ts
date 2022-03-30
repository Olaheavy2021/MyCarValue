import { UserService } from './../users.service';
import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable
} from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService:UserService){}
    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const {userId} = request.session || {};

        if(userId){
            console.log(userId);
           const user = await this.userService.findOne(parseInt(userId));
           request.CurrentUser = user
        }

        return next.handle();
    }

}