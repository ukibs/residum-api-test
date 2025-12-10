import { jwtTokenManagerBuilder } from "../../../../shared/contexts/infrastructure/jwt/jwt-token-manager";
import { env } from "../../config/env";

export const tokenManager = jwtTokenManagerBuilder(env.AUTH_JWT_SECRET);
