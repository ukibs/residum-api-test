import { DomainEvent } from "../../../../../shared/contexts/domain/events/domain-event";

export class ContactNotificationClientDomainEvent extends DomainEvent {
    constructor(readonly body: string) {
        super({ eventId: "event-management.events.contact-notification-client", eventBody: body });
    }
}
