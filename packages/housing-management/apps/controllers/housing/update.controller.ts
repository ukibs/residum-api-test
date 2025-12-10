import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../../../../shared/apps/lambda";
import { StringValueObject } from "../../../../shared/contexts/domain/value-objects";
import { tokenManager } from "../../dependencies/services/jwt-token-manager.service";
import { createHousing, updateHousing } from "../../dependencies/usecases/housing.usecase";
import { isNil } from "../../../../shared/utils/type-checkers";

export async function updateHousingController(req: Request): Promise<Response> {
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

    const pathParameters = req.pathParameters;

    try {
        const [result, error] = await updateHousing({
            executedBy: tokenManager.getUserFrom(token.value),
            input: {
                ...JSON.parse(body.value),
                id: pathParameters.id,
            },
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
            body: JSON.stringify(result),
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
