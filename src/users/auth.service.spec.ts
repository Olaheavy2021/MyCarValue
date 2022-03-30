import { NotFoundException } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "./users.service";
import { filter } from 'rxjs';

//jest.setTimeout(10000);

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UserService>;

beforeEach(async () => {
    const users : User[] = [];

    //Create a fake copy of the users service
     fakeUsersService = {
        find: (email:string) => {
            const filteredUsers = users.filter(user => user.email === email);
            return Promise.resolve(filteredUsers);
        },
        create: (email: string, password: string) =>{
            const user = {id: Math.floor(Math.random() * 999999 ), email, password,} as User;
            users.push(user);
            return Promise.resolve(user);
        }
    };

    const module = await Test.createTestingModule({
        providers:[
            AuthService,
            {

              provide:UserService,
              useValue: fakeUsersService
                
            }
        ]
    }).compile()
    service = module.get(AuthService);

});

it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
});

it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('unittest@test.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt,hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
});

// it('throws an error if user signs up with email that is in use', async (done) => {
//     fakeUsersService.find = () => Promise.resolve([{id: 1, email:'a', password:'1'} as User]);
//     try{
//         await service.signup('asdf@asdf.com', 'asdf');

//     }catch(err){
//         done();
//     }

     
// });

it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
        BadRequestException
    );

     
});

it('throws if sign is called with an unused email',async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
        NotFoundException
    );
});

it('throws if an invalid password is provide',async () => {
    await service.signup('asdf@asdf.com', 'asdf');

     await expect(service.signin('asdf@asdf.com','asdfg')).rejects.toThrow(
        BadRequestException
     )
    
})

it('returns a user if correct password is provided',async () => {
    await service.signup('asdf@asdf.com', 'asdf');

     const user = await service.signin('asdf@asdf.com', 'asdf');

     expect(user).toBeDefined();
    
})


})

