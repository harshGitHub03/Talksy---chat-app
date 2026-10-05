import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient()
        const cookie = client.handshake.headers.cookie;

        if (!cookie)
            throw new UnauthorizedException()

        const token = this.getTokenFromCookie(cookie);

        if(!token)
            throw new UnauthorizedException()

        try {
            const payload=this.jwtService.verify(token)
            client.data.user=payload
        } catch (error) {
            throw new UnauthorizedException()
        }
        return true
    }

    private getTokenFromCookie(cookie: string): string | null {
        const tokenCookie = cookie
            .split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith('token='));

        return tokenCookie
            ? tokenCookie.split('=')[1]
            : null;
    }
}