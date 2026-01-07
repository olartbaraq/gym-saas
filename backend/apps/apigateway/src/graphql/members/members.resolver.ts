import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembersService } from './members.service';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';

@Resolver('Member')
export class MembersResolver {
  constructor(private readonly membersService: MembersService) {}

  @Mutation('createMember')
  create(@Args('createMemberInput') createMemberInput: CreateMemberInput) {
    return this.membersService.create(createMemberInput);
  }

  @Query('members')
  findAll() {
    return this.membersService.findAll();
  }

  @Query('member')
  findOne(@Args('id') id: number) {
    return this.membersService.findOne(id);
  }

  @Mutation('updateMember')
  update(@Args('updateMemberInput') updateMemberInput: UpdateMemberInput) {
    return this.membersService.update(updateMemberInput.id, updateMemberInput);
  }

  @Mutation('removeMember')
  remove(@Args('id') id: number) {
    return this.membersService.remove(id);
  }
}
