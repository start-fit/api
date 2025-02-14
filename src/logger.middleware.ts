import { Injectable, NestMiddleware, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';



@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) { }
  async use(@Req() req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization?.includes("Bearer ")) {
      const token = req.headers.authorization;
      const sucsses = await this.jwt.verifyAsync(token.replace("Bearer ", ""), {
        secret: process.env.SECRETE_KEY,
      })
      req.user = sucsses;
      return next();
    }

    throw new UnauthorizedException();
  }
}
