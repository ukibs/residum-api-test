import { Request, Response } from "../../shared/apps/lambda";
import { routes } from "./routes";

export async function handler(event: Request, context: any): Promise<Response> {
    // ⭐ CRÍTICO: Evita que Lambda espere el event loop vacío
    context.callbackWaitsForEmptyEventLoop = false;
    const { resource, httpMethod: method } = event;
    console.debug("Handling call: ", resource, " - ", method);

    try {
        // Validar que la ruta existe
        if (!routes[resource] || !routes[resource][method]) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Route not found" }),
            };
        }

        return await routes[resource][method](event);
    } catch (error: any) {
        console.error("Handler error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Internal server error",
                message: error.message,
            }),
        };
    }
}
