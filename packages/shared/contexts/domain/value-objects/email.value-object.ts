import { isEmpty, isEmptyString, isNil, isString } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { StringValueObject } from "./string.value-object";

export class EmailValueObject extends StringValueObject {
    public static override create(property: string, email: string): EmailValueObject {
        if (isNil(email)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (isEmptyString(email)) {
            throw new FieldValidationError(`Property '${property}' must be a non-empty string`);
        }

        if (!isValidEmailAddress(email)) {
            throw new FieldValidationError(`Property '${property}' must be a valid email`);
        }

        return new EmailValueObject(email);
    }

    public static override createOptional(
        property: string,
        email?: string
    ): EmailValueObject | undefined {
        if (email === null) {
            return new EmailValueObject(null);
        }

        if (isNil(email) || isEmpty(email)) {
            return undefined;
        }

        if (!isString(email)) {
            throw new FieldValidationError(`Property '${property}' must be a string`);
        }

        if (!isValidEmailAddress(email)) {
            throw new FieldValidationError(`Property '${property}' must be a valid email`);
        }

        return new EmailValueObject(email);
    }
}

export function isValidEmailAddress(email: string): boolean {
    const emailRegex = /^(.+)@(\S+)$/;
    return emailRegex.test(email);
}
