import { Router } from "../../../shared/apps/lambda";
import { housingRoutes } from "./housing.routes";

export const routes = Router({
    "/v1/housing": housingRoutes,
});
