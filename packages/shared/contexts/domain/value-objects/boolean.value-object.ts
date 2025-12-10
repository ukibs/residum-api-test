import { isBoolean, isNil } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { ValueObject } from "./value-object";

export class BooleanValueObject extends ValueObject<{ value: boolean }> {
    protected constructor(value: boolean) {
        super({ value });
    }

    public get value(): boolean {
        return this.props.value;
    }

    public static create(property: string, value: boolean): BooleanValueObject {
        if (isNil(value)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        // TODO: Added by Martín to faccilitaty conversion from DDBB data
        if (!isBoolean(value)) {
            const numericValue = value as number;
            if (numericValue === 0) {
                value = false;
            } else {
                throw new FieldValidationError(`Property '${property}' must be a boolean`);
            }
        }

        return new BooleanValueObject(value);
    }

    public static createOptional(
        property: string,
        value?: boolean
    ): BooleanValueObject | undefined {
        if (value === null) {
            return new BooleanValueObject(null);
        }

        if (isNil(value)) {
            return undefined;
            // return new BooleanValueObject(false);
        }
        // NOTA: Added by Martín to faccilitaty conversion from DDBB data
        if (!isBoolean(value)) {
            const numericValue = value as number;
            if (numericValue === 0) {
                value = false;
            } else {
                throw new FieldValidationError(`Property '${property}' must be a boolean`);
            }
        }

        return new BooleanValueObject(value);
    }
}
