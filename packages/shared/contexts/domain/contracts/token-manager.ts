import { AuthorizedUserProperties } from "../models/authorized-user.entity";

export interface TokenManager {
    createToken(user: AuthorizedUserProperties): string;
    getUserFrom(token: string): AuthorizedUserProperties;
    verifyToken(token: string): boolean;
}
