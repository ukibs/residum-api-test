import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import {
    BooleanValueObject,
    NumberValueObject,
    StringValueObject,
    TimestampValueObject,
    DatetimeValueObject,
    UUID,
    UrlValueObject,
} from "../../../../../shared/contexts/domain/value-objects";
import { isNil } from "../../../../../shared/utils/type-checkers";
// import { TicketLanguageInfo } from "./ticket_language_info.entity";

export type TicketProperties = {
    id: UUID;
    name: StringValueObject;
    event_id: UUID;
    description?: StringValueObject;
    // stock: NumberValueObject;
    initial_stock: NumberValueObject;
    price: NumberValueObject;
    tickets_policy?: StringValueObject;
    is_visible: BooleanValueObject;
    international_discount?: NumberValueObject;
    early_payment_discount?: NumberValueObject;
    early_payment_discount_date?: TimestampValueObject;
    promotional_code?: StringValueObject;
    promotional_code_discount?: NumberValueObject;
    // only_international: BooleanValueObject;
    last_modified_at?: TimestampValueObject;
    created_at?: TimestampValueObject;
    iva?: NumberValueObject;
    only_in_app?: BooleanValueObject;

    start_date?: DatetimeValueObject;
    end_date?: DatetimeValueObject;

    domain_names?: UrlValueObject[];

    // ticket_language_infos?: TicketLanguageInfo[];
    default_language?: StringValueObject;

    position?: NumberValueObject;

    second_payment_end_date?: DatetimeValueObject;
};

export class Ticket extends Entity<TicketProperties> {
    public get value(): Primitives<TicketProperties> {
        return {
            id: this.props.id.value,
            name: this.props.name.value,
            event_id: this.props.event_id.value,
            description: this.props.description?.value,
            // stock: this.props.stock.value,
            initial_stock: this.props.initial_stock.value,
            price: this.props.price.value,
            tickets_policy: this.props.tickets_policy?.value,
            international_discount: this.props.international_discount?.value,
            early_payment_discount: this.props.early_payment_discount?.value,
            early_payment_discount_date: this.props.early_payment_discount_date?.value,
            promotional_code: this.props.promotional_code?.value,
            promotional_code_discount: this.props.promotional_code_discount?.value,
            // only_international: this.props.only_international.value,
            is_visible: this.props.is_visible?.value,
            last_modified_at: this.props.last_modified_at?.value,
            created_at: this.props.created_at?.value,
            iva: this.props.iva?.value,
            only_in_app: this.props.only_in_app?.value,

            start_date: this.props.start_date?.value,
            end_date: this.props.end_date?.value,

            domain_names: this.props.domain_names
                ? this.props.domain_names?.map((domain_name) => domain_name.value)
                : undefined,

            // ticket_language_infos: this.props.ticket_language_infos?.map(
            //     (ticket_language_info) => ticket_language_info.value
            // ),
            default_language: this.props.default_language?.value,

            position: this.props.position?.value,

            second_payment_end_date: this.props.second_payment_end_date?.value,
        };
    }

    public static create(props: Primitives<TicketProperties>): Maybe<Ticket> {
        try {
            const ticket = new Ticket({
                id: props.id ? UUID.create("id", props.id) : UUID.generate(),
                name: StringValueObject.create("name", props.name),
                event_id: UUID.create("event_id", props.event_id),
                description: StringValueObject.createOptional("description", props.description),
                // stock: NumberValueObject.create("stock", props.stock),
                initial_stock: NumberValueObject.create("initial_stock", props.initial_stock),
                price: NumberValueObject.create("price", props.price),
                tickets_policy: StringValueObject.createOptional(
                    "tickets_policy",
                    props.tickets_policy
                ),
                international_discount: NumberValueObject.createOptional(
                    "international_discount",
                    props.international_discount
                ),
                early_payment_discount: NumberValueObject.createOptional(
                    "early_payment_discount",
                    props.early_payment_discount
                ),
                early_payment_discount_date: TimestampValueObject.createOptional(
                    "early_payment_discount_date",
                    props.early_payment_discount_date
                ),
                promotional_code: StringValueObject.createOptional(
                    "promotional_code",
                    props.promotional_code
                ),
                promotional_code_discount: NumberValueObject.createOptional(
                    "promotional_code_discount",
                    props.promotional_code_discount
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
                iva: NumberValueObject.createOptional("iva", props.iva),
                only_in_app: BooleanValueObject.createOptional("only_in_app", props.only_in_app),

                start_date: DatetimeValueObject.createOptional("start_date", props.start_date),
                end_date: DatetimeValueObject.createOptional("end_date", props.end_date),

                domain_names: isNil(props.domain_names)
                    ? []
                    : props.domain_names.map((domain_name) =>
                          UrlValueObject.create("domain_name", domain_name)
                      ),

                // ticket_language_infos: props.ticket_language_infos
                //     ? props.ticket_language_infos.map((ticket_language_info) => {
                //         const [result, error] = TicketLanguageInfo.create(ticket_language_info);
                //         if (error) {
                //             console.debug(error);
                //             throw new Error(
                //                 "Error creating ticket language infos: " + error.message
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

                second_payment_end_date: DatetimeValueObject.createOptional(
                    "second_payment_end_date",
                    props.second_payment_end_date
                ),
            });

            return [ticket, null];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
