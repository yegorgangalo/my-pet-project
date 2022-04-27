import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/token/token.service';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const [bearer, accessToken] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException({
          message: 'User is unauthorized',
        });
      }

      const user = this.tokenService.validateToken(accessToken);
      req.user = user;

      const hasUserPermission = user.roles.some(role =>
        requiredRoles.includes(role.value),
      );

      return !!user && hasUserPermission;
    } catch (e) {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
  }
}
