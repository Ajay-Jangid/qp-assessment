import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Your request is not authorized');
    }

    const token = authHeader.split(' ')[1];

    try {
      const data = this.jwtService.verify(token);
      request.user = data; // Adding user for further use in roles guard.
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
