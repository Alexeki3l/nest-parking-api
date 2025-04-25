// src/logs/log.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from '../logs.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    private readonly logsService: LogsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    const token = req.headers.authorization?.split(' ')[1];

    res.on('finish', async () => {
      const statusCode = res.statusCode;
      let decode: any = null;
      try {
        decode = this.jwtService.verify(token);
      } catch (err) {
        console.error('Invalid JWT:', err.message);
        throw new UnauthorizedException('Token inválido');
      }
      this.logsService.createLog({
        method,
        path: originalUrl,
        statusCode,
        timestamp: new Date(),
        userId: decode.id,
      });
    });

    next();
  }
}
