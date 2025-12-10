import { DomainEvent } from "../events/domain-event";

export interface EventBus {
    publish(event: DomainEvent): Promise<unknown>;
}
