import { isEmpty, isEmptyString, isNil } from "../../utils/type-checkers";
import { FieldValidationError, UserNotAuthorizedError } from "../domain/errors";
import { AuthorizedUserProperties } from "../domain/models/authorized-user.entity";

export type UseCaseRequest<Input> = {
    executedBy?: AuthorizedUserProperties;
    input?: Input;
};

export type UseCase<Input, Response> = (request: UseCaseRequest<Input>) => Promise<Response>;

type UseCaseWithoutAuth<Input, Response> = {
    useCase: UseCase<Input, Response>;
};

type UseCaseWithAuth<Input, Response> = {
    useCase: UseCase<Input, Response>;
    roles: string[];
    claims: string[];
};

export function useCaseBuilder<Input, Response>({
    useCase,
}: UseCaseWithoutAuth<Input, Response>): UseCase<Input, Response> {
    return async function useCaseWihtoutAuthorization({
        input,
    }: UseCaseRequest<Input>): Promise<Response> {
        return useCase({ input });
    };
}

export function useCaseAuthorizedBuilder<Input, Response>({
    useCase,
    roles,
    claims,
}: UseCaseWithAuth<Input, Response>): UseCase<Input, Response> {
    return async function useCaseAuthorized({
        executedBy,
        input,
    }: UseCaseRequest<Input>): Promise<Response> {
        if (isNil(executedBy)) {
            throw new FieldValidationError("Authorized user is required");
        }

        if (isEmptyString(executedBy)) {
            throw new FieldValidationError("Authorized user must be valid");
        }

        const userRoles = executedBy.roles;
        if (!isEmpty(roles) && !roles.some((role) => userRoles.includes(role))) {
            throw new UserNotAuthorizedError("User does not have the required roles");
        }

        // TODO: Solo pedir claims según el usuario
        const userClaims = executedBy.claims;
        if (!isEmpty(claims) && !claims.every((claim) => userClaims.includes(claim))) {
            throw new UserNotAuthorizedError("User does not have the required claims");
        }

        return useCase({ executedBy, input });
    };
}
