import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './team-member.entity.js';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './team-member.dto.js';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamMember) private readonly repo: Repository<TeamMember>,
  ) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  create(dto: CreateTeamMemberDto) {
    return this.repo.save(
      this.repo.create({
        name: dto.name,
        role: dto.role,
        bio: dto.bio ?? '',
        image: dto.image ?? '',
        sortOrder: dto.sortOrder ?? 0,
      }),
    );
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Team member ${id} not found`);
    Object.assign(item, Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)));
    return this.repo.save(item);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Team member ${id} not found`);
  }

  count() {
    return this.repo.count();
  }
}
