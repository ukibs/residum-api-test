import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import { StringValueObject, UUID } from "../../../../../shared/contexts/domain/value-objects";

export type EventCategoryProperties = {
    id: UUID;
    event_id: UUID;
    category_id?: UUID;
    category_name?: StringValueObject;
    subcategory_id?: UUID;
    subcategory_name?: StringValueObject;
};

export class EventCategory extends Entity<EventCategoryProperties> {
    public get value(): Primitives<EventCategoryProperties> {
        return {
            id: this.props.id.value,
            event_id: this.props.event_id.value,
            category_id: this.props.category_id?.value,
            category_name: this.props.category_name?.value,
            subcategory_id: this.props.subcategory_id?.value,
            subcategory_name: this.props.subcategory_name?.value,
        };
    }

    public static create(props: Primitives<EventCategoryProperties>): Maybe<EventCategory> {
        try {
            console.log("Creating extra from props: ", props);
            return [
                new EventCategory({
                    id: props.id ? UUID.create("id", props.id) : UUID.generate(),
                    event_id: UUID.create("event_id", props.event_id),
                    category_id: UUID.createOptional("category_id", props.category_id),
                    category_name: StringValueObject.createOptional(
                        "category_name",
                        props.category_name
                    ),
                    subcategory_id: UUID.createOptional("subcategory_id", props.subcategory_id),
                    subcategory_name: StringValueObject.createOptional(
                        "subcategory_name",
                        props.subcategory_name
                    ),
                }),
                null,
            ];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
