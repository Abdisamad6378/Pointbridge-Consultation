import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { TeamMember } from './team-member.entity.js';
import { TeamService } from './team.service.js';
import { AdminTeamController, PublicTeamController } from './team.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember]), AuthGuardsModule],
  controllers: [PublicTeamController, AdminTeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
