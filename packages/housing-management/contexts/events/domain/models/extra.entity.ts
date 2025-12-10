import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import {
    BooleanValueObject,
    NumberValueObject,
    StringValueObject,
    TimestampValueObject,
    UrlValueObject,
    UUID,
} from "../../../../../shared/contexts/domain/value-objects";
import { isNil } from "../../../../../shared/utils/type-checkers";
// import { ExtraLanguageInfo } from "./extra_language_info.entity";
import { ValidationError, DatabaseError } from "./errors.class"; // Importa las clases de error personalizadas

export type ExtraProperties = {
    id: UUID;
    name: StringValueObject;
    event_id: UUID;
    tickets_ids?: UUID[];
    short_description?: StringValueObject;
    description?: StringValueObject;
    description_design?: StringValueObject;
    images?: StringValueObject;
    // stock: NumberValueObject;
    stock_by_ticket_max?: NumberValueObject;
    initial_stock?: NumberValueObject;
    price: NumberValueObject;
    is_visible: BooleanValueObject;
    international_discount?: NumberValueObject;
    // only_international: BooleanValueObject;
    last_modified_at?: TimestampValueObject;
    created_at?: TimestampValueObject;
    // early_payment_discount_date?: TimestampValueObject;
    times_can_be_consumed?: NumberValueObject;

    // extra_language_infos?: ExtraLanguageInfo[];
    default_language?: StringValueObject;

    position?: NumberValueObject;

    no_after_sales?: BooleanValueObject;

    extra_template_id?: UUID;

    domain_names?: UrlValueObject[];

    hotel_id?: UUID;
    tags?: StringValueObject;
};

export class Extra extends Entity<ExtraProperties> {
    public get value(): Primitives<ExtraProperties> {
        return {
            id: this.props.id.value,
            name: this.props.name.value,
            event_id: this.props.event_id.value,
            tickets_ids: this.props.tickets_ids
                ? this.props.tickets_ids.map((ticket_id) => ticket_id.value)
                : undefined,
            short_description: this.props.short_description?.value,
            description: this.props.description?.value,
            description_design: this.props.description_design?.value,
            images: this.props.images?.value,
            // stock: this.props.stock.value,
            stock_by_ticket_max: this.props.stock_by_ticket_max?.value,
            initial_stock: this.props.initial_stock?.value,
            price: this.props.price.value,
            international_discount: this.props.international_discount?.value,
            // only_international: this.props.only_international.value,
            is_visible: this.props.is_visible?.value,
            last_modified_at: this.props.last_modified_at?.value,
            created_at: this.props.created_at?.value,
            // early_payment_discount_date: this.props.early_payment_discount_date?.value,
            times_can_be_consumed: this.props.times_can_be_consumed?.value,

            // extra_language_infos: this.props.extra_language_infos?.map(
            //     (extra_language_info) => extra_language_info.value
            // ),
            default_language: this.props.default_language?.value,

            position: this.props.position?.value,

            no_after_sales: this.props.no_after_sales?.value,

            extra_template_id: this.props.extra_template_id?.value,

            domain_names: this.props.domain_names
                ? this.props.domain_names?.map((domain_name) => domain_name.value)
                : undefined,

            hotel_id: this.props.hotel_id?.value,
            tags: this.props.tags?.value,
        };
    }

    public static create(props: Primitives<ExtraProperties>): Maybe<Extra> {
        try {
            console.log("Creating extra from props: ", props);
            return [
                new Extra({
                    id: props.id ? UUID.create("id", props.id) : UUID.generate(),
                    name: StringValueObject.create("name", props.name),
                    event_id: UUID.create("event_id", props.event_id),
                    tickets_ids: props.tickets_ids
                        ? props.tickets_ids.map((ticket_id) => UUID.create("ticket_id", ticket_id))
                        : undefined,
                    short_description: StringValueObject.createOptional(
                        "short_description",
                        props.short_description
                    ),
                    description: StringValueObject.createOptional("description", props.description),
                    description_design: StringValueObject.createOptional(
                        "description_design",
                        props.description_design
                    ),
                    images: StringValueObject.createOptional("images", props.images),
                    // stock: NumberValueObject.create("stock", props.stock),
                    stock_by_ticket_max: NumberValueObject.createOptional(
                        "stock_by_ticket_max",
                        props.stock_by_ticket_max
                    ),
                    initial_stock: NumberValueObject.createOptional(
                        "initial_stock",
                        props.initial_stock
                    ),
                    price: NumberValueObject.create("price", props.price),
                    international_discount: NumberValueObject.createOptional(
                        "international_discount",
                        props.international_discount
                    ),
                    // only_international: BooleanValueObject.create(
                    //     "only_international",
                    //     props.only_international
                    // ),
                    is_visible: BooleanValueObject.createOptional("is_visible", props.is_visible),
                    last_modified_at: TimestampValueObject.createOptional(
                        "last_modified_at",
                        props.last_modified_at
                    ),
                    created_at: TimestampValueObject.createOptional("created_at", props.created_at),
                    // early_payment_discount_date: TimestampValueObject.createOptional(
                    //     "early_payment_discount_date",
                    //     props.early_payment_discount_date
                    // ),
                    times_can_be_consumed: NumberValueObject.createOptional(
                        "times_can_be_consumed",
                        props.times_can_be_consumed
                    ),

                    // extra_language_infos: props.extra_language_infos
                    //     ? props.extra_language_infos.map((extra_language_info) => {
                    //         const [result, error] = ExtraLanguageInfo.create(extra_language_info);
                    //         if (error) {
                    //             console.debug(error);
                    //             throw new Error(
                    //                 "Error creating extra language infos: " + error.message
                    //             );
                    //         }
                    //         return result;
                    //     })
                    //     : undefined,
                    default_language: StringValueObject.createOptional(
                        "default_language",
                        props.default_language
                    ),

                    position: NumberValueObject.createOptional("position", props.position),

                    no_after_sales: BooleanValueObject.createOptional(
                        "no_after_sales",
                        props.no_after_sales
                    ),

                    extra_template_id: UUID.createOptional(
                        "extra_template_id",
                        props.extra_template_id
                    ),

                    domain_names: isNil(props.domain_names)
                        ? []
                        : props.domain_names.map((domain_name) =>
                              UrlValueObject.create("domain_name", domain_name)
                          ),

                    hotel_id: UUID.createOptional("hotel_id", props.hotel_id),
                    tags: StringValueObject.createOptional("tags", props.tags),
                }),
                null,
            ];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
