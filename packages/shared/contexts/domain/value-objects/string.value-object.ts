import { isEmpty, isEmptyString, isNil, isString } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { ValueObject } from "./value-object";

export class StringValueObject extends ValueObject<{ value: string }> {
    protected constructor(value: string) {
        super({ value });
    }

    public get value(): string {
        return this.props.value;
    }

    public static create(property: string, value: string): StringValueObject {
        if (isNil(value)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (isEmptyString(value)) {
            throw new FieldValidationError(`Property '${property}' must be a non-empty string`);
        }

        return new StringValueObject(value);
    }

    public static createOptional(property: string, value?: string): StringValueObject | undefined {
        if (value === null) {
            return new StringValueObject(null);
        }

        if (isNil(value) || isEmpty(value)) {
            return undefined;
            // return new StringValueObject("");
        }

        if (!isString(value)) {
            throw new FieldValidationError(`Property '${property}' must be a string`);
        }

        return new StringValueObject(value);
    }
}
