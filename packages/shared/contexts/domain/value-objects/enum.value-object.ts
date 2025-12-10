import { hasValue, isEmpty, isEmptyString, isNil, isString } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { StringValueObject } from "./string.value-object";

type GenericEnum = { [s: number]: string };

export class EnumValueObject extends StringValueObject {
    public static initiate<Enum extends GenericEnum>(
        property: string,
        value: string,
        enumList: Enum
    ): EnumValueObject {
        if (isNil(value)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (isEmptyString(value)) {
            throw new FieldValidationError(`Property '${property}' must be a non-empty string`);
        }

        const isValidType = Object.values<string>(enumList).includes(value);
        if (hasValue(value) && !isValidType) {
            throw new FieldValidationError(
                `Value of StringValueObject must be one of ${Object.values(enumList)}`
            );
        }

        return new EnumValueObject(value);
    }

    public static initiateOptional<Enum extends GenericEnum>(
        property: string,
        value: string,
        enumList: Enum
    ): EnumValueObject | undefined {
        if (value === null) {
            return new EnumValueObject(null);
        }

        if (isNil(value) || isEmpty(value)) {
            return undefined;
        }

        if (!isString(value)) {
            throw new FieldValidationError(`Property '${property}' must be a string`);
        }

        const isValidType = Object.values<string>(enumList).includes(value);
        if (hasValue(value) && !isValidType) {
            throw new FieldValidationError(
                `Value of StringValueObject must be one of ${Object.values(enumList)}`
            );
        }

        return new EnumValueObject(value);
    }
}
