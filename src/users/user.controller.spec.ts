import { User } from './user.entity';
import { AuthService } from './auth.service';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let userController: UsersController;
  let fakeUsersService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
      fakeUsersService = {
         findOne:(id:number) => {
             return Promise.resolve({id, email:'asdf@asdf.com', password:'asdf'} as User)
         },
         find: (email: string) => {
             return Promise.resolve([{id:1, email,password:'asdf'} as User])
         },
        //  remove:() => {},
        //  update:() => {}
      };

      fakeAuthService = {
        // signin:() => {},
        // signup:() => {}

        
      };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
          {
              provide: UserService,
              useValue: fakeUsersService
          },
          {
              provide: AuthService,
              useValue: fakeAuthService
          }
      ]
    }).compile();

    userController = app.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
      expect(userController).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given emaail',async () => {
      const users = await userController.findAllUsers('asdf@asdf.com');
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('asdf@asdf.com');

  })
  
});
