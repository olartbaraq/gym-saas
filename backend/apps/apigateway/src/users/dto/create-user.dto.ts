import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'User address',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
  @ApiProperty({
    example: 'New York',
    description: 'User location',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
