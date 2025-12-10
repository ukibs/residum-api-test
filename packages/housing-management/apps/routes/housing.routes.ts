import { createHousingController } from "../controllers/housing/create.controller";
import { deleteHousingController } from "../controllers/housing/delete.controller";
import { findAllOwnersController } from "../controllers/housing/find-all-owners.controller";
import { findAllHousingController } from "../controllers/housing/find-all.controller";
import { findHousingByIdController } from "../controllers/housing/find-by-id.controller";
import { findDomainEventsController } from "../controllers/housing/find-domain-events.controller";
import { findOwnerByIdController } from "../controllers/housing/find-owner-by-id.controller";
import { updateOwnerController } from "../controllers/housing/update-owner.controller";
import { updateHousingController } from "../controllers/housing/update.controller";

export const housingRoutes = {
    "/": {
        POST: createHousingController,
        GET: findAllHousingController,
    },
    "/{id}": {
        GET: findHousingByIdController,
        PUT: updateHousingController,
        DELETE: deleteHousingController,
    },
    "/owners": {
        GET: findAllOwnersController,
    },
    "/owners/{id}": {
        GET: findOwnerByIdController,
        PUT: updateOwnerController,
        //DELETE: deleteHousingController,
    },
    "/events": {
        GET: findDomainEventsController,
    },
};
