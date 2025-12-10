import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export type Request = APIGatewayProxyEvent;
export type Response = APIGatewayProxyResult;

type LambdaController = (event: Request) => Promise<Response>;
type LambdaRouter = Record<string, Record<string, LambdaController>>;

export function Router(
    resources: Record<string, Record<string, unknown>>
): LambdaRouter {
    const router: LambdaRouter = {};

    for (const [resource, routes] of Object.entries(resources)) {
        for (const [route, methods] of Object.entries(routes)) {
            const uri = `${resource}${route}`.endsWith("/")
                ? `${resource}${route}`.slice(0, -1)
                : `${resource}${route}`;

            router[uri] = methods as Record<string, LambdaController>;
        }
    }

    return router;
}
