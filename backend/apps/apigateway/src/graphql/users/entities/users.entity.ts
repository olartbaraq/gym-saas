import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Users {
  @Field(() => [User])
  users: User[];
}


