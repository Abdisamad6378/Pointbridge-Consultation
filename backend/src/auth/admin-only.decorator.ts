import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Roles } from './roles.decorator.js';

// The consuming module must import AuthGuardsModule.
export const AdminOnly = () => applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles('admin'));
