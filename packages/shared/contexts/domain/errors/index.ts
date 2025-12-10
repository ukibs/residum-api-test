export { DatabaseError } from "./database.error";
export { EntityAlreadyExistsError } from "./entity-already-exists.error";
export { EntityNotExistsError } from "./entity-not-exists.error";
export { FieldValidationError } from "./field-validation.error";
export { InvalidUuidError } from "./invalid-uuid.error";
export { UserNotAuthorizedError } from "./user-not-authorized.error";

export type Maybe<Entity> = [Entity | null, Error | null];
