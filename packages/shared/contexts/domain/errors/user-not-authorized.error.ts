export class UserNotAuthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserNotAuthorizedError";
    }
}
