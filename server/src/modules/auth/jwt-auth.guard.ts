import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const [bearer, accessToken] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException({
          message: 'User is unauthorized',
        });
      }

      const user = this.tokenService.validateToken(accessToken);
      req.user = user;

      return !!user;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'User is unauthorized',
      });
    }
  }
}
