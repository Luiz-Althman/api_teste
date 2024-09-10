import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService create with the correct data', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        nickname: 'johnd',
        email: 'john.doe@example.com',
        role: 'estudante',
        password: 'password123',
      };

      await controller.create(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call UserService findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call UserService findOne with the correct id', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call UserService update with the correct data', async () => {
      const updateUserDto: UpdateUserDto = {
        id: 1,
        name: 'Jane',
        surname: 'Smith',
        nickname: 'janes',
        email: 'jane.smith@example.com',
        role: 'professor',
        password: 'newpassword123',
      };

      await controller.update(updateUserDto);
      expect(service.update).toHaveBeenCalledWith(updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call UserService remove with the correct id', async () => {
      const id = 1;
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
