import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../../../../shared/apps/lambda";
import { StringValueObject } from "../../../../shared/contexts/domain/value-objects";
import { tokenManager } from "../../dependencies/services/jwt-token-manager.service";
import { getAllHousing } from "../../dependencies/usecases/housing.usecase";
import { isNil } from "../../../../shared/utils/type-checkers";

export async function findAllHousingController(req: Request): Promise<Response> {
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

    const queryStringParameters = req.queryStringParameters;

    const input = queryStringParameters
        ? {
              search: queryStringParameters.search,
              is_reserved: queryStringParameters.is_reserved
                  ? queryStringParameters.is_reserved === "true"
                  : undefined,
              property_type: queryStringParameters.property_type,
              premise_id: queryStringParameters.premise_id,
              page: parseInt(queryStringParameters.page),
              perPage: parseInt(queryStringParameters.perPage),
              asc: queryStringParameters.asc,
              desc: queryStringParameters.desc,
          }
        : {};

    try {
        const [result, error] = await getAllHousing({
            executedBy: tokenManager.getUserFrom(token.value),
            input,
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
