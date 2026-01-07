import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  FindAllUsersDto,
  Message,
  UpdateUserDto,
  User,
} from '@app/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    if (createUserDto.provider === AuthProvider.LOCAL) {
      if (!createUserDto.password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      isActive: true,
      isDeleted: false,
      isSubscribed: false,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    this.logger.log('User created', {
      tag: 'Auth Service',
      data: { ...userWithoutPassword },
      userId: savedUser.id,
    });
    return { ...userWithoutPassword };
  }

  async findAll(query: FindAllUsersDto) {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 50;
      const offset = (page - 1) * limit;

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Apply filter conditions (AND logic)
      if (query?.filter?.isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', {
          isActive: query.filter.isActive,
        });
      }
      if (query?.filter?.isSubscribed !== undefined) {
        queryBuilder.andWhere('user.isSubscribed = :isSubscribed', {
          isSubscribed: query.filter.isSubscribed,
        });
      }
      if (query?.filter?.isDeleted !== undefined) {
        queryBuilder.andWhere('user.isDeleted = :isDeleted', {
          isDeleted: query.filter.isDeleted,
        });
      }
      if (query?.filter?.role) {
        queryBuilder.andWhere('user.role = :role', {
          role: query.filter.role,
        });
      }
      if (query?.filter?.location) {
        queryBuilder.andWhere('user.location = :location', {
          location: query.filter.location,
        });
      }

      // Apply search conditions (OR logic across multiple fields)
      if (query?.search) {
        const searchPattern = `%${query.search}%`;
        queryBuilder.andWhere(
          '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR user.location LIKE :search)',
          { search: searchPattern },
        );
      }

      // Apply ordering
      queryBuilder.orderBy('user.createdAt', 'DESC');
      queryBuilder.addOrderBy('user.updatedAt', 'DESC');

      // Apply pagination
      queryBuilder.take(limit);
      queryBuilder.skip(offset);

      const [users, total] = await queryBuilder.getManyAndCount();

      this.logger.log('Users found', {
        tag: 'Auth Service',
        total,
        data: { users },
        page,
        limit,
      });

      return { data: { users }, total, page, limit };
    } catch (error) {
      this.logger.error('Error finding users', {
        tag: 'Auth Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.logger.log('User found', {
        tag: 'Auth Service',
        data: user,
        userId: user.id,
      });

      return user;
    } catch (error) {
      this.logger.error('Error finding user', {
        tag: 'Auth Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.logger.log('User found by email', {
        tag: 'Auth Service',
        data: user,
        email: user.email,
      });

      return user;
    } catch (error) {
      this.logger.error('Error finding user by email', {
        tag: 'Auth Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      //Only update the fields that are provided in the updateUserDto
      const updatedFields = Object.keys(updateUserDto).filter(
        (key) => updateUserDto[key] !== undefined,
      );
      const updatedUser = {
        ...user,
        ...Object.fromEntries(
          updatedFields.map((key) => [key, updateUserDto[key]]),
        ),
        updatedAt: new Date().toISOString(),
      };

      const savedUser = await this.userRepository.save(updatedUser);

      this.logger.log('User updated', {
        tag: 'Auth Service',
        data: savedUser,
        userId: updatedUser.id,
      });
      return savedUser;
    } catch (error) {
      this.logger.error('Error updating user', {
        tag: 'Auth Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const softDeletedUser = {
        ...user,
        isDeleted: true,
        isActive: false,
        isSubscribed: false,
        updatedAt: new Date().toISOString(),
      };

      const savedUser = await this.userRepository.save(softDeletedUser);

      this.logger.log('User soft deleted', {
        tag: 'Auth Service',
        data: savedUser,
        userId: savedUser.id,
      });
      return { message: 'User soft deleted' };
    } catch (error) {
      this.logger.error('Error soft deleting user', {
        tag: 'Auth Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<Users> {
  //   const subject = new Subject<Users>();

  //   const onNext = (paginationDto: PaginationDto) => {
  //     const start = paginationDto.page * paginationDto.limit;
  //     subject.next({ users: this.users.slice(start, start + paginationDto.limit) });
  //   };

  //   const onComplete = () => {
  //     subject.complete();
  //   };

  //   const onError = (error: Error) => {
  //     subject.error(error);
  //   };

  //   paginationDtoStream.subscribe({
  //     next: onNext,
  //     error: onError,
  //     complete: onComplete,
  //   });

  //   return subject.asObservable();
  // }
}
