import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from '../logs.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    private readonly logsService: LogsService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    const token = req.headers.authorization?.split(' ')[1];

    res.on('finish', async () => {
      const statusCode = res.statusCode;
      let decode: any = null;

      decode = this.jwtService.decode(token);

      this.logsService.createLog({
        method,
        path: originalUrl,
        statusCode,
        timestamp: new Date(),
        user: { id: decode?.id, role: decode?.role },
      });
    });

    next();
  }
}
