import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Primitives } from "../../../../../shared/contexts/domain/models/entity";
import { HousingRepository } from "../../domain/contracts/housing.repository";
import { Housing, HousingProperties } from "../../domain/models/housing.entity";

export type UpdateEventInput = {
    id: string;
    housing: Primitives<HousingProperties>;
    // event: Primitives<EventProperties>;
};

export function updateHousingBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<UpdateEventInput, Maybe<any>> {
    return async function updateEvent({
        input,
    }: UseCaseRequest<UpdateEventInput>): Promise<Maybe<any>> {
        const { housing: housingData, id } = input;

        // //
        // const [grouping, gError] = await eventRepository.getPremiseGrouping(input.premise_id);
        // if (gError) return [null, gError];
        // const grouping_id = grouping.id;

        // console.debug("Input: ", input);
        // return [null, new Error("In development")];

        //
        const [housing, hError] = Housing.create({
            ...housingData,
            id,
            // grouping_id,
        });
        if (hError) {
            console.debug("Error creating housing object: ", hError);
            return [null, hError];
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

        return await housingRepository.update(input.id, housing);
    };
}
