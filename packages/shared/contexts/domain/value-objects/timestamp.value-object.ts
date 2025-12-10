import { isNil, isNumber } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { NumberValueObject } from "./number.value-object";

export class TimestampValueObject extends NumberValueObject {
    public static override create(property: string, timestamp: number) {
        if (isNil(timestamp)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (!isNumber(timestamp)) {
            throw new FieldValidationError(`Property '${property}' must be a number`);
        }

        return new TimestampValueObject(timestamp);
    }

    public static override createOptional(property: string, timestamp: number) {
        if (timestamp === null) {
            return new TimestampValueObject(null);
        }

        if (isNil(timestamp)) {
            return undefined;
            // return null;
            // return new TimestampValueObject(null);
        }

        if (!isNumber(timestamp)) {
            throw new FieldValidationError(`Property '${property}' must be a number`);
        }

        return new TimestampValueObject(timestamp);
    }
}
