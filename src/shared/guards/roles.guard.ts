import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true; // If no roles are specified, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user.role; // User is attached to the request object (from authorization Guard)

        if (!user || !requiredRoles.includes(user)) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
