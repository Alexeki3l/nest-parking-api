// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard], // ¡exporta para que otros módulos puedan usarlo!
})
export class SharedModule {}
