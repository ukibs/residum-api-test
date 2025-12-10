import { sign, verify } from "jsonwebtoken";
import { hasValue, isNil } from "../../../utils/type-checkers";
import { TokenManager } from "../../domain/contracts/token-manager";
import { FieldValidationError } from "../../domain/errors";
import { AuthorizedUserProperties } from "../../domain/models/authorized-user.entity";

export function jwtTokenManagerBuilder(secret: string): TokenManager {
    const expiresIn = "5y";
    const algorithm = "HS256";

    return {
        createToken(user: AuthorizedUserProperties): string {
            return sign(user, secret, { algorithm, expiresIn });
        },

        getUserFrom(token: string): AuthorizedUserProperties {
            if (isNil(token)) {
                throw new FieldValidationError("Authorization token is required");
            }

            const user = verify(token, secret, {
                algorithms: [algorithm],
            }) as AuthorizedUserProperties;

            if (isNil(user)) {
                throw new FieldValidationError("Authorization token is invalid");
            }

            return user;
        },

        verifyToken(token: string): boolean {
            const decoded = verify(token, secret, { algorithms: [algorithm] });
            return hasValue(decoded);
        },
    };
}
