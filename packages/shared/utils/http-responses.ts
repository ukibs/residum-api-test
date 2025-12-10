import { StatusCodes } from "http-status-codes";

// Tipos para mejor tipado
export interface ApiResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}

export interface ApiError {
    error: string;
    code?: string;
    details?: unknown;
}

export interface ApiSuccess<T = any> {
    data?: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
}

// Headers por defecto
const DEFAULT_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Función base para crear respuestas
export const createResponse = (
    statusCode: number,
    body: any,
    additionalHeaders: Record<string, string> = {}
): ApiResponse => ({
    statusCode,
    headers: { ...DEFAULT_HEADERS, ...additionalHeaders },
    body: JSON.stringify(body),
});

// Respuestas de éxito
export const ok = <T>(data: T, message?: string, meta?: any): ApiResponse =>
    createResponse(StatusCodes.OK, { data, message, meta });

export const created = <T>(data: T, message?: string): ApiResponse =>
    createResponse(StatusCodes.CREATED, { data, message });

export const noContent = (): ApiResponse => createResponse(StatusCodes.NO_CONTENT, {});

// Respuestas de error del cliente (4xx)
export const badRequest = (error: string, code?: string, details?: unknown): ApiResponse =>
    createResponse(StatusCodes.BAD_REQUEST, { error, code, details });

export const unauthorized = (error = "Authentication required", code?: string): ApiResponse =>
    createResponse(StatusCodes.UNAUTHORIZED, { error, code });

export const forbidden = (error = "Access denied", code?: string): ApiResponse =>
    createResponse(StatusCodes.FORBIDDEN, { error, code });

export const notFound = (error = "Resource not found", code?: string): ApiResponse =>
    createResponse(StatusCodes.NOT_FOUND, { error, code });

export const conflict = (error: string, code?: string): ApiResponse =>
    createResponse(StatusCodes.CONFLICT, { error, code });

export const unprocessableEntity = (error: string, details?: unknown): ApiResponse =>
    createResponse(StatusCodes.UNPROCESSABLE_ENTITY, { error, details });

export const tooManyRequests = (error = "Rate limit exceeded"): ApiResponse =>
    createResponse(StatusCodes.TOO_MANY_REQUESTS, { error });

// Respuestas de error del servidor (5xx)
export const internalServerError = (error = "Internal server error", code?: string): ApiResponse =>
    createResponse(StatusCodes.INTERNAL_SERVER_ERROR, { error, code });

export const notImplemented = (error = "Not implemented"): ApiResponse =>
    createResponse(StatusCodes.NOT_IMPLEMENTED, { error });

export const serviceUnavailable = (error = "Service unavailable"): ApiResponse =>
    createResponse(StatusCodes.SERVICE_UNAVAILABLE, { error });

// Funciones de conveniencia para casos comunes
export const validationError = (field: string, message: string): ApiResponse =>
    badRequest(`Validation failed for ${field}`, "VALIDATION_ERROR", { field, message });

export const missingParameter = (parameter: string): ApiResponse =>
    badRequest(`Missing required parameter: ${parameter}`, "MISSING_PARAMETER", { parameter });

export const invalidParameter = (parameter: string, reason?: string): ApiResponse =>
    badRequest(
        `Invalid parameter: ${parameter}${reason ? ` - ${reason}` : ""}`,
        "INVALID_PARAMETER",
        { parameter, reason }
    );

export const invalidUUID = (parameter: string): ApiResponse =>
    invalidParameter(parameter, "Must be a valid UUID v4");

export const invalidToken = (): ApiResponse =>
    unauthorized("Invalid or expired token", "INVALID_TOKEN");

export const missingAuthHeader = (): ApiResponse =>
    unauthorized(
        "Missing authorization header. Expected format: 'Bearer <token>'",
        "MISSING_AUTH_HEADER"
    );

// Helper para mapear errores automáticamente
export const mapErrorToResponse = (error: Error): ApiResponse => {
    console.error("Error:", { name: error.name, message: error.message, stack: error.stack });

    switch (error.name) {
        case "AuthError":
        case "UnauthorizedError":
        case "TokenExpiredError":
            return unauthorized("Authentication failed", error.name);

        case "ValidationError":
            return badRequest("Invalid request parameters", error.name);

        case "NotFoundError":
            return notFound("Resource not found", error.name);

        case "ForbiddenError":
            return forbidden("Access denied", error.name);

        case "ConflictError":
            return conflict(error.message, error.name);

        case "RateLimitError":
            return tooManyRequests(error.message);

        default:
            // No exponer detalles del error interno
            return internalServerError("An unexpected error occurred", error.name);
    }
};

// Para compatibilidad con el código existente
export const respond = createResponse;
