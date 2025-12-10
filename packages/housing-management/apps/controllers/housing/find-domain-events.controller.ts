import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../../../../shared/apps/lambda";
import { getDomainEvents } from "../../dependencies/usecases/housing.usecase";

export async function findDomainEventsController(req: Request): Promise<Response> {
    // if (isNil(req.headers["Authorization"])) {
    //     return {
    //         statusCode: StatusCodes.UNAUTHORIZED,
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //         body: JSON.stringify({ error: "Missing required authorization header" }),
    //     };
    // }

    // const token = StringValueObject.create("token", req.headers["Authorization"].split(" ")[1]);

    const queryStringParameters = req.queryStringParameters;

    const input = queryStringParameters
        ? {
              domain: queryStringParameters.domain,
              category_id: queryStringParameters.category_id,
              subcategory_id: queryStringParameters.subcategory_id,
              search: queryStringParameters.search,
              is_reserved: queryStringParameters.is_reserved === "true",
              property_type: queryStringParameters.property_type,
              premise_id: queryStringParameters.premise_id,
              distance_to_center: queryStringParameters.distance_to_center,
              asc: queryStringParameters.asc,
              desc: queryStringParameters.desc,
              page: parseInt(queryStringParameters.page),
              perPage: parseInt(queryStringParameters.perPage),
          }
        : {};

    try {
        const [result, error] = await getDomainEvents({
            // executedBy: tokenManager.getUserFrom(token.value),
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
