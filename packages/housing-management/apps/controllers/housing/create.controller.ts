import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../../../../shared/apps/lambda";
import { StringValueObject } from "../../../../shared/contexts/domain/value-objects";
import { tokenManager } from "../../dependencies/services/jwt-token-manager.service";
import { createHousing } from "../../dependencies/usecases/housing.usecase";
import { isNil } from "../../../../shared/utils/type-checkers";

export async function createHousingController(req: Request): Promise<Response> {
    if (isNil(req.headers["Authorization"])) {
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Missing required authorization header" }),
        };
    }

    const token = StringValueObject.create("token", req.headers["Authorization"].split(" ")[1]);

    if (isNil(req.body)) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Missing required request body" }),
        };
    }

    const body = StringValueObject.create("body", req.body);

    try {
        const [event, error] = await createHousing({
            executedBy: tokenManager.getUserFrom(token.value),
            input: JSON.parse(body.value),
        });

        if (error) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: error.message }),
            };
        }

        return {
            statusCode: StatusCodes.CREATED,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(event.value),
        };
    } catch (e) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: e.message }),
        };
    }
}
