import {
    useCaseAuthorizedBuilder,
    useCaseBuilder,
} from "../../../../shared/contexts/application/usecase";
import { createHousingBuilder } from "../../../contexts/events/application/usecases/create.usecase";
import { housingRepository } from "../repositories/mariadb.repository";
import { ROLES } from "../../../../shared/utils/constansts";
import { eventBus } from "../services/sqs-event-bus.service";
import { updateHousingBuilder } from "../../../contexts/events/application/usecases/update.usecase";
import { getHousingByIdBuilder } from "../../../contexts/events/application/usecases/get-by-id.usecase";
import { getAllHousingBuilder } from "../../../contexts/events/application/usecases/get-all.usecase";
import { deleteHousingBuilder } from "../../../contexts/events/application/usecases/delete.usecase";
import { updateOwnerBuilder } from "../../../contexts/events/application/usecases/update-owner.usecase";
import { getOwnerByIdBuilder } from "../../../contexts/events/application/usecases/get-owner-by-id.usecase";
import { getAllOwnersBuilder } from "../../../contexts/events/application/usecases/get-all-owners.usecase";
import { getDomainEventsBuilder } from "../../../contexts/events/application/usecases/get-domain-events.usecase";

// Housing
export const createHousing = useCaseAuthorizedBuilder({
    useCase: createHousingBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

export const getAllHousing = useCaseAuthorizedBuilder({
    useCase: getAllHousingBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

export const getHousingById = useCaseBuilder({
    useCase: getHousingByIdBuilder({ housingRepository }),
});

export const updateHousing = useCaseAuthorizedBuilder({
    useCase: updateHousingBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

export const deleteHousing = useCaseAuthorizedBuilder({
    useCase: deleteHousingBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

// Owners
export const getAllOwners = useCaseAuthorizedBuilder({
    useCase: getAllOwnersBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

export const getOwnerById = useCaseAuthorizedBuilder({
    useCase: getOwnerByIdBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

export const updateOwner = useCaseAuthorizedBuilder({
    useCase: updateOwnerBuilder({ housingRepository }),
    roles: [ROLES.SUPER_ADMIN, ROLES.HOUSING],
    claims: [],
});

// Events
export const getDomainEvents = useCaseBuilder({
    useCase: getDomainEventsBuilder({ housingRepository }),
});
