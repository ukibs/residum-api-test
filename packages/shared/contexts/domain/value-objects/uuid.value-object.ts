import { v4 as uuidV4, validate } from "uuid";
import { isEmpty, isEmptyString, isNil, isString } from "../../../utils/type-checkers";
import { FieldValidationError, InvalidUuidError } from "../errors";
import { StringValueObject } from "./string.value-object";

export class UUID extends StringValueObject {
    public static generate() {
        return new UUID(uuidV4());
    }

    public static override create(property: string, uuid: string) {
        if (isNil(uuid)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (isEmptyString(uuid)) {
            throw new FieldValidationError(`Property '${property}' must be a non-empty string`);
        }

        if (!validate(uuid)) {
            throw new InvalidUuidError(uuid);
        }

        return new UUID(uuid);
    }

    public static override createOptional(property: string, uuid: string) {
        if (uuid === null) {
            return new UUID(null);
        }

        if (isNil(uuid) || isEmpty(uuid)) {
            return undefined;
            // return new UUID("");
        }

        if (!isString(uuid)) {
            throw new FieldValidationError(`Property '${property}' must be a string`);
        }

        if (!validate(uuid)) {
            throw new InvalidUuidError(uuid);
        }

        return new UUID(uuid);
    }
}
