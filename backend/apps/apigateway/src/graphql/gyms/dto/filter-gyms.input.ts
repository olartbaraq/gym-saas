import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterGymsInput {
  @Field({ nullable: true })
  name?: string;
}


