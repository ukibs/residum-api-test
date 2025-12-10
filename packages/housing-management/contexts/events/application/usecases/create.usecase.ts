import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Primitives } from "../../../../../shared/contexts/domain/models/entity";
import { Clock } from "../../../../../shared/contexts/domain/services/clock.service";
import { UUID } from "../../../../../shared/contexts/domain/value-objects";
import { HousingRepository } from "../../domain/contracts/housing.repository";
import { Event, EventProperties } from "../../domain/models/event.entity";
import { Housing, HousingProperties } from "../../domain/models/housing.entity";
import { Owner, OwnerProperties } from "../../domain/models/owner.entity";

export type CreateEventInput = {
    owner?: Primitives<OwnerProperties>;
    housing: Primitives<HousingProperties>;
    parentEvent: Primitives<EventProperties>;
    childEvents: Primitives<EventProperties>[];
};

export function createHousingBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<CreateEventInput, Maybe<any>> {
    function assignTicketsAndExtrasData(eventId: string, eventData: any) {
        // Tickets
        if (eventData.tickets) {
            for (let i = 0; i < eventData.tickets.length; i++) {
                eventData.tickets[i].event_id = eventId;
                eventData.tickets[i].initial_stock = 1;
            }
        }
        // Extras
        if (eventData.extras) {
            for (let i = 0; i < eventData.extras.length; i++) {
                eventData.extras[i].event_id = eventId;
                eventData.extras[i].initial_stock = 1;
                eventData.extras[i].stock_by_ticket_max = 1;
            }
        }
    }

    return async function createEvent({
        input,
    }: UseCaseRequest<CreateEventInput>): Promise<Maybe<any>> {
        const {
            owner: ownerData,
            housing: housingData,
            parentEvent: parentEventData,
            childEvents: childEventsData,
        } = input;

        if (!ownerData && !housingData.owner_id) {
            return [null, new Error("A housing has to have an owner")];
        }

        const ownerId = ownerData ? UUID.generate().value : housingData.owner_id;
        const housingId = UUID.generate().value;
        const parentEventId = UUID.generate().value;
        const created_at = Clock.getDateTime(Clock.now());

        // //
        // const [grouping, gError] = await eventRepository.getPremiseGrouping(input.premise_id);
        // if (gError) return [null, gError];
        // const grouping_id = grouping.id;

        // console.debug("Input: ", input);
        // return [null, new Error("In development")];

        //
        let owner, oError;
        if (ownerData) {
            [owner, oError] = Owner.create({
                ...ownerData,
                id: ownerId,
                created_at,
                // grouping_id,
            });
            if (oError) {
                console.debug("Error creating housing object: ", oError);
                return [null, oError];
            }
        }

        //
        const [housing, hError] = Housing.create({
            ...housingData,
            id: housingId,
            owner_id: ownerId,
            created_at,
            // grouping_id,
        });
        if (hError) {
            console.debug("Error creating housing object: ", hError);
            return [null, hError];
        }

        // Parent event tickets and extras
        assignTicketsAndExtrasData(parentEventId, parentEventData);

        //
        const [parentEvent, peError] = Event.create({
            ...parentEventData,
            id: parentEventId,
            housing_id: housingId,
            multi_date: true,
            created_at,
            event_categories: input.parentEvent.event_categories
                ? input.parentEvent.event_categories.map((ec, ecIndex) => ({
                      id: UUID.generate().value,
                      event_id: parentEventId,
                      ...ec,
                  }))
                : null,
            // is_visible: true,
            // is_active: true,
            // created_at,
            // grouping_id,
        });
        if (peError) {
            console.debug("Error creating event object: ", peError);
            return [null, peError];
        }
        // console.debug("Parent event value: ", parentEvent.value);

        //
        const childEvents = [];
        if (childEventsData) {
            for (let i = 0; i < childEventsData.length; i++) {
                // Child events tickets and extras
                const eventId = UUID.generate().value;
                assignTicketsAndExtrasData(eventId, childEventsData[i]);
                //
                const [childEvent, ceError] = Event.create({
                    ...childEventsData[i],
                    id: eventId,
                    housing_id: housingId,
                    parent_event_id: parentEventId,
                    multi_date: true,
                    created_at,
                    event_categories: childEventsData[i].event_categories
                        ? childEventsData[i].event_categories.map((ec, ecIndex) => ({
                              id: UUID.generate().value,
                              event_id: eventId,
                              ...ec,
                          }))
                        : null,
                    // is_visible: true,
                    // is_active: true,
                    // created_at,
                    // grouping_id,
                });
                if (ceError) {
                    console.debug("Error creating event object: ", ceError);
                    return [null, ceError];
                }
                childEvents.push(childEvent);
            }
        }

        return await housingRepository.create(owner, housing, parentEvent, childEvents);
    };
}
