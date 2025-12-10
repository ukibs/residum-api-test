import { isNil, isNumber } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { Clock } from "../services/clock.service";
import { StringValueObject } from "./string.value-object";

export class DatetimeValueObject extends StringValueObject {
    public static override create(property: string, datetime: string) {
        if (isNil(datetime)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (!isNumber(Clock.getTime(datetime))) {
            throw new FieldValidationError(`Property '${property}' must be a valid date`);
        }

        return new DatetimeValueObject(Clock.getDateTime(Clock.getTime(datetime)));
    }

    public static override createOptional(property: string, datetime: string) {
        if (datetime === null) {
            return new DatetimeValueObject(null);
        }

        if (isNil(datetime)) {
            return undefined;
        }

        if (!isNumber(Clock.getTime(datetime))) {
            throw new FieldValidationError(`Property '${property}' must be a valid date`);
        }

        return new DatetimeValueObject(Clock.getDateTime(Clock.getTime(datetime)));
    }
}
