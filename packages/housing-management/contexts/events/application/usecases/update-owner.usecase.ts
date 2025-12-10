import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Primitives } from "../../../../../shared/contexts/domain/models/entity";
import { HousingRepository } from "../../domain/contracts/housing.repository";
import { Owner, OwnerProperties } from "../../domain/models/owner.entity";

export type UpdateEventInput = {
    id: string;
    owner: Primitives<OwnerProperties>;
    // event: Primitives<EventProperties>;
};

export function updateOwnerBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<UpdateEventInput, Maybe<any>> {
    return async function updateOwner({
        input,
    }: UseCaseRequest<UpdateEventInput>): Promise<Maybe<any>> {
        const { owner: ownerData, id } = input;

        // //
        // const [grouping, gError] = await eventRepository.getPremiseGrouping(input.premise_id);
        // if (gError) return [null, gError];
        // const grouping_id = grouping.id;

        // console.debug("Input: ", input);
        // return [null, new Error("In development")];

        //
        const [owner, oError] = Owner.create({
            ...ownerData,
            id,
            // grouping_id,
        });
        if (oError) {
            console.debug("Error creating housing object: ", oError);
            return [null, oError];
        }

        //
        // const [event, eError] = Event.create({
        //     ...eventData,
        //     id: eventId,
        //     housing_id: housingId,
        //     // created_at,
        //     // grouping_id,
        // });
        // if (eError) {
        //     console.debug("Error creating event object: ", eError);
        //     return [null, eError];
        // }

        return await housingRepository.updateOwner(input.id, owner);
    };
}
