import { AuthGuard } from './../guards/auth.guard';
import { Body,
         Controller, 
         Post, 
         Get,
         Patch,
         Param,
         Query, 
         Delete,
         Session,
         UseGuards,
         NotFoundException} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";
import { UserService } from "./users.service";
//import { Serialize } from 'src/interceptors/serilalize.interceptor';
import { UserDto } from "./dtos/user-dto";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { CurrentUser } from "./decorators/current-user.decorator";


@Controller('auth')
//@Serialize(UserDto)
export class UsersController{
    constructor(private usersService: UserService, private authService:AuthService ){}

    // @Get('/colors/:color')
    // setColor(@Param('color') color:string, @Session() session:any){
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //     return session.color;
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    WhoAmI(@CurrentUser() user : User ){
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }


    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session:any){
        const user = await  this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    
    //@UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id : string){
        console.log('Hanlder is running');
        const user =await  this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email:string){
        return this.usersService.find(email);
    }

    @Delete(':id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body);
    }




}