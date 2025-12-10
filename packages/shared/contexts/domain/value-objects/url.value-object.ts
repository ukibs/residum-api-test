import { isEmpty, isEmptyString, isNil, isString } from "../../../utils/type-checkers";
import { FieldValidationError } from "../errors";
import { StringValueObject } from "./string.value-object";

export class UrlValueObject extends StringValueObject {
    public static override create(property: string, url: string): UrlValueObject {
        if (isNil(url)) {
            throw new FieldValidationError(`Property '${property}' must be provided`);
        }

        if (isEmptyString(url)) {
            throw new FieldValidationError(`Property '${property}' must be a non-empty string`);
        }

        if (url === "ESNULO") {
            return new UrlValueObject(url);
        }

        if (!isValidUrl(url)) {
            throw new FieldValidationError(`Property '${property}' must be a valid url`);
        }

        return new UrlValueObject(url);
    }

    public static override createOptional(
        property: string,
        url?: string
    ): UrlValueObject | undefined {
        if (url === null) {
            return new UrlValueObject(null);
        }

        if (isNil(url) || isEmpty(url)) {
            return undefined;
            // return new UrlValueObject("");
        }

        if (!isString(url)) {
            throw new FieldValidationError(`Property '${property}' must be a string`);
        }

        if (url === "ESNULO") {
            return new UrlValueObject(url);
        }

        if (!isValidUrl(url)) {
            throw new FieldValidationError(`Property '${property}' must be a valid url`);
        }

        return new UrlValueObject(url);
    }
}

export function isValidUrl(url: string): boolean {
    const urlRegex = new RegExp(
        "^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))|" +
            "localhost" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    return urlRegex.test(url);
}
