import { Clock } from "../services/clock.service";

export abstract class DomainEvent {
    constructor(private readonly event: { eventId: string; eventBody: string }) {}

    public get params() {
        return {
            MessageBody: this.event.eventBody,
            MessageDeduplicationId: `${this.event.eventId}-${Clock.now()}`,
            MessageGroupId: this.event.eventId,
        };
    }
}
