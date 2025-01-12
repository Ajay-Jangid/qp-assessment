import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email: username } });
        if (user && password === user.password) {
            const { password, ...result } = user; // Exclude password from result
            return result;
        }
        throw new UnauthorizedException('Invalid username or password');
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign(user),
        };
    }
}
