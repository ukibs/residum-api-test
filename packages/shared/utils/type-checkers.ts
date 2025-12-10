export function isNil(value: unknown): value is undefined | null | typeof NaN {
    return value === undefined || value === null;
}

export function hasValue(value: unknown): value is NonNullable<unknown> {
    return !isNil(value);
}

export function isEmptyString(value: unknown): value is string {
    return typeof value === "string" && isEmpty(value);
}

export function isEmpty<T>(value: string | T[]): boolean {
    return value.length === 0;
}

export function isObjectEmpty<T extends Record<string, unknown>>(obj: T): boolean {
    return Object.keys(obj).length === 0;
}

export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export function isString(value: unknown): value is string {
    return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

// Validaciones de string con contenido
export function isNonEmptyString(value: unknown): value is string {
    return isString(value) && !isEmpty(value.trim());
}

// Validaciones UUID
export function isValidUUID(value: unknown): value is string {
    if (!isString(value)) {
        return false;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value.trim());
}

export function isValidUUIDv4(value: unknown): value is string {
    return isValidUUID(value); // Alias más específico
}

// Validaciones avanzadas de string
export function isValidEmail(value: unknown): value is string {
    if (!isString(value)) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
}

export function isValidUrl(value: unknown): value is string {
    if (!isString(value)) {
        return false;
    }

    try {
        new URL(value.trim());
        return true;
    } catch {
        return false;
    }
}

// Validaciones numéricas
export function isPositiveNumber(value: unknown): value is number {
    return isNumber(value) && value > 0;
}

export function isNonNegativeNumber(value: unknown): value is number {
    return isNumber(value) && value >= 0;
}

export function isInteger(value: unknown): value is number {
    return isNumber(value) && Number.isInteger(value);
}

export function isPositiveInteger(value: unknown): value is number {
    return isInteger(value) && value > 0;
}

// Validaciones de arrays
export function isNonEmptyArray<T>(value: unknown): value is T[] {
    return isArray(value) && !isEmpty(value);
}

export function isArrayOf<T>(
    value: unknown,
    itemValidator: (item: unknown) => item is T
): value is T[] {
    return isArray(value) && value.every(itemValidator);
}

// Validaciones de objetos
export function isNonEmptyObject<T extends Record<string, unknown>>(value: unknown): value is T {
    return (
        typeof value === "object" &&
        hasValue(value) &&
        !isArray(value) &&
        !isObjectEmpty(value as T)
    );
}

// Helpers combinados para casos comunes
export function isValidStringId(value: unknown): value is string {
    return isNonEmptyString(value) && (isValidUUID(value) || /^[a-zA-Z0-9_-]+$/.test(value));
}

export function isValidPathParameter(value: unknown): value is string {
    return isNonEmptyString(value) && value.length <= 255;
}
