import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterUsersInput {
  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  isSubscribed?: boolean;

  @Field({ nullable: true })
  isDeleted?: boolean;

  @Field({ nullable: true })
  role?: string;
}


