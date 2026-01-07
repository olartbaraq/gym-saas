import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('GymConfigInput')
export class GymConfig {
  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field({ nullable: true })
  policies?: string;
}


