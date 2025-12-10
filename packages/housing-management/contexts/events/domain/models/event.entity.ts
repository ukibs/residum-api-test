import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import {
    BooleanValueObject,
    NumberValueObject,
    StringValueObject,
    DatetimeValueObject,
    UUID,
    UrlValueObject,
} from "../../../../../shared/contexts/domain/value-objects";
import { isNil } from "../../../../../shared/utils/type-checkers";
import { EventCategory } from "./event_category.entity";
import { Extra } from "./extra.entity";
import { Ticket } from "./ticket.entity";

export type EventProperties = {
    id: UUID;
    sku?: StringValueObject;
    name: StringValueObject;
    subtitle?: StringValueObject;
    premise_id: UUID;
    event_type?: StringValueObject;
    event_tag?: StringValueObject;
    image_url?: UrlValueObject;
    header_url?: UrlValueObject;
    slider_urls?: UrlValueObject[]; // TODO: Revisar si así está bien
    principal_url?: UrlValueObject;
    video_url?: UrlValueObject;
    location?: StringValueObject;
    latitude?: NumberValueObject;
    longitude?: NumberValueObject;
    min_age?: NumberValueObject;
    outfit?: StringValueObject;

    created_at?: DatetimeValueObject;
    start_date?: DatetimeValueObject;
    end_date?: DatetimeValueObject;
    start_sale_date?: DatetimeValueObject;
    end_sale_date?: DatetimeValueObject;
    publication_date?: DatetimeValueObject;
    end_of_publication_date?: DatetimeValueObject;
    included_options?: StringValueObject; // TODO: Mirar si lo gestionamos aqui
    not_included_options?: StringValueObject;
    is_visible?: BooleanValueObject;
    is_active?: BooleanValueObject;
    is_international?: BooleanValueObject;
    last_modified_at?: DatetimeValueObject;
    description?: StringValueObject;
    short_description?: StringValueObject;
    additional_info?: StringValueObject;
    // total_capacity: NumberValueObject;
    // limit_tickets_order: NumberValueObject;
    // city_id: StringValueObject;
    // autovalidation: BooleanValueObject;

    tickets?: Ticket[];
    extras?: Extra[];

    grouping_id?: UUID;

    rating?: NumberValueObject;
    countries?: NumberValueObject;
    cities?: NumberValueObject;
    days?: NumberValueObject;
    nights?: NumberValueObject;

    default_language?: StringValueObject;

    seo_name?: StringValueObject;

    without_night?: BooleanValueObject;
    passport_required?: BooleanValueObject;

    multi_date?: BooleanValueObject;

    tour_leader_ids?: UUID[];
    pensions_type?: StringValueObject;
    rooms_type?: StringValueObject;

    parent_event_id?: UUID;

    is_b2b?: BooleanValueObject;
    is_catalogue_visible?: BooleanValueObject;

    agents_that_can_see_ids?: StringValueObject[];

    pvp?: NumberValueObject;

    app_contact_form?: BooleanValueObject;

    housing_id?: UUID;

    event_categories?: EventCategory[];
};

export class Event extends Entity<EventProperties> {
    public get value(): Primitives<EventProperties> {
        return {
            id: this.props.id.value,
            sku: this.props.sku?.value,
            name: this.props.name.value,
            subtitle: this.props.subtitle?.value,
            premise_id: this.props.premise_id.value,
            event_type: this.props.event_type?.value,
            event_tag: this.props.event_tag?.value,
            image_url: this.props.image_url?.value,
            header_url: this.props.header_url?.value,
            slider_urls: this.props.slider_urls?.map((url) => url.value),
            principal_url: this.props.principal_url?.value,
            video_url: this.props.video_url?.value,
            location: this.props.location?.value,
            latitude: this.props.latitude?.value,
            longitude: this.props.longitude?.value,
            min_age: this.props.min_age?.value,
            outfit: this.props.outfit?.value,
            created_at: this.props.created_at?.value,
            start_date: this.props.start_date?.value,
            end_date: this.props.end_date?.value,
            start_sale_date: this.props.start_sale_date?.value,
            end_sale_date: this.props.end_sale_date?.value,
            publication_date: this.props.publication_date?.value,
            end_of_publication_date: this.props.end_of_publication_date?.value,
            included_options: this.props.included_options?.value,
            not_included_options: this.props.not_included_options?.value,
            is_visible: this.props.is_visible?.value,
            is_active: this.props.is_active?.value,
            is_international: this.props.is_international?.value,
            last_modified_at: this.props.last_modified_at?.value,
            description: this.props.description?.value,
            short_description: this.props.short_description?.value,
            additional_info: this.props.additional_info?.value,
            // total_capacity: this.props.total_capacity.value,
            // limit_tickets_order: this.props.limit_tickets_order.value,
            // city_id: this.props.city_id.value,
            // autovalidation: this.props.autovalidation.value,

            tickets: this.props.tickets
                ? this.props.tickets.map((ticket) => ticket.value)
                : undefined,
            extras: this.props.extras ? this.props.extras.map((extra) => extra.value) : undefined,

            //
            grouping_id: this.props.grouping_id?.value,

            //
            rating: this.props.rating?.value,
            countries: this.props.countries?.value,
            cities: this.props.cities?.value,
            days: this.props.days?.value,
            nights: this.props.nights?.value,

            default_language: this.props.default_language?.value,

            seo_name: this.props.seo_name?.value,

            without_night: this.props.without_night?.value,
            passport_required: this.props.passport_required?.value,

            multi_date: this.props.multi_date?.value,

            tour_leader_ids: this.props.tour_leader_ids
                ? this.props.tour_leader_ids.map((tour_leader_id) => tour_leader_id.value)
                : undefined,
            pensions_type: this.props.pensions_type?.value,
            rooms_type: this.props.rooms_type?.value,

            parent_event_id: this.props.parent_event_id?.value,

            is_b2b: this.props.is_b2b?.value,
            is_catalogue_visible: this.props.is_catalogue_visible?.value,

            agents_that_can_see_ids: this.props.agents_that_can_see_ids
                ? this.props.agents_that_can_see_ids.map(
                      (agent_that_can_see_id) => agent_that_can_see_id.value
                  )
                : undefined,

            pvp: this.props.pvp?.value,

            app_contact_form: this.props.app_contact_form?.value,

            housing_id: this.props.housing_id?.value,

            event_categories: this.props.event_categories
                ? this.props.event_categories.map((extra_category) => extra_category.value)
                : undefined,
        };
    }

    public static create(props: Primitives<EventProperties>): Maybe<Event> {
        try {
            console.debug("Creating event from props: ", props);
            return [
                new Event({
                    id: UUID.create("id", props.id),
                    sku: StringValueObject.createOptional("sku", props.sku),
                    name: StringValueObject.create("name", props.name),
                    subtitle: StringValueObject.createOptional("subtitle", props.subtitle),
                    premise_id: UUID.create("premise_id", props.premise_id),
                    event_type: StringValueObject.createOptional("event_type", props.event_type),
                    event_tag: StringValueObject.createOptional("event_tag", props.event_tag),
                    image_url: UrlValueObject.createOptional("image_url", props.image_url),
                    header_url: UrlValueObject.createOptional("header_url", props.header_url),
                    slider_urls: isNil(props.slider_urls)
                        ? []
                        : props.slider_urls.map((url) => {
                              return UrlValueObject.create("slider_urls", url);
                          }),
                    principal_url: UrlValueObject.createOptional(
                        "principal_url",
                        props.principal_url
                    ),
                    video_url: UrlValueObject.createOptional("video_url", props.video_url),
                    location: StringValueObject.createOptional("location", props.location),
                    latitude: NumberValueObject.createOptional("latitude", props.latitude),
                    longitude: NumberValueObject.createOptional("longitude", props.longitude),
                    min_age: NumberValueObject.createOptional("min_age", props.min_age),
                    outfit: StringValueObject.createOptional("outfit", props.outfit),
                    created_at: DatetimeValueObject.createOptional("created_at", props.created_at),
                    start_date: DatetimeValueObject.createOptional("start_date", props.start_date),
                    end_date: DatetimeValueObject.createOptional("end_date", props.end_date),
                    start_sale_date: DatetimeValueObject.createOptional(
                        "start_sale_date",
                        props.start_sale_date
                    ),
                    end_sale_date: DatetimeValueObject.createOptional(
                        "end_sale_date",
                        props.end_sale_date
                    ),
                    publication_date: DatetimeValueObject.createOptional(
                        "publication_date",
                        props.publication_date
                    ),
                    end_of_publication_date: DatetimeValueObject.createOptional(
                        "end_of_publication_date",
                        props.end_of_publication_date
                    ),
                    included_options: StringValueObject.createOptional(
                        "included_options",
                        props.included_options
                    ),
                    not_included_options: StringValueObject.createOptional(
                        "not_included_options",
                        props.not_included_options
                    ),
                    is_visible: BooleanValueObject.createOptional("is_visible", props.is_visible),
                    is_active: BooleanValueObject.createOptional("is_active", props.is_active),
                    is_international: BooleanValueObject.createOptional(
                        "is_international",
                        props.is_international
                    ),
                    last_modified_at: DatetimeValueObject.createOptional(
                        "last_modified_at",
                        props.last_modified_at
                    ),
                    description: StringValueObject.createOptional("description", props.description),
                    short_description: StringValueObject.createOptional(
                        "short_description",
                        props.short_description
                    ),
                    additional_info: StringValueObject.createOptional(
                        "additional_info",
                        props.additional_info
                    ),
                    // total_capacity: NumberValueObject.create(
                    //     "total_capacity",
                    //     props.total_capacity
                    // ),
                    // limit_tickets_order: NumberValueObject.create(
                    //     "limit_tickets_order",
                    //     props.limit_tickets_order
                    // ),
                    // city_id: StringValueObject.create("city_id", props.city_id),
                    // autovalidation: BooleanValueObject.create(
                    //     "autovalidation",
                    //     props.autovalidation
                    // ),
                    //
                    tickets: props.tickets
                        ? props.tickets.map((ticket) => {
                              const [result, error] = Ticket.create(ticket);
                              if (error) {
                                  console.debug(error);
                                  throw new Error("Error creating tickets: " + error.message);
                              }
                              return result;
                          })
                        : undefined,
                    extras: props.extras
                        ? props.extras.map((extra) => {
                              const [result, error] = Extra.create(extra);
                              if (error) {
                                  console.debug(error);
                                  throw new Error("Error creating extras: " + error.message);
                              }
                              return result;
                          })
                        : undefined,

                    grouping_id: UUID.createOptional("grouping_id", props.grouping_id),
                    //
                    rating: NumberValueObject.createOptional("rating", props.rating),
                    countries: NumberValueObject.createOptional("countries", props.countries),
                    cities: NumberValueObject.createOptional("cities", props.cities),
                    days: NumberValueObject.createOptional("days", props.days),
                    nights: NumberValueObject.createOptional("nights", props.nights),

                    default_language: StringValueObject.createOptional(
                        "default_language",
                        props.default_language
                    ),

                    seo_name: StringValueObject.createOptional("seo_name", props.seo_name),

                    without_night: BooleanValueObject.createOptional(
                        "without_night",
                        props.without_night
                    ),
                    passport_required: BooleanValueObject.createOptional(
                        "passport_required",
                        props.passport_required
                    ),

                    multi_date: BooleanValueObject.createOptional("multi_date", props.multi_date),

                    tour_leader_ids: props.tour_leader_ids
                        ? props.tour_leader_ids.map((tour_leader_id) =>
                              UUID.create("tour_leader_id", tour_leader_id)
                          )
                        : undefined,
                    pensions_type: StringValueObject.createOptional(
                        "pensions_type",
                        props.pensions_type
                    ),
                    rooms_type: StringValueObject.createOptional("rooms_type", props.rooms_type),

                    parent_event_id: UUID.createOptional("parent_event_id", props.parent_event_id),

                    is_b2b: BooleanValueObject.createOptional("is_b2b", props.is_b2b),
                    is_catalogue_visible: BooleanValueObject.createOptional(
                        "is_catalogue_visible",
                        props.is_catalogue_visible
                    ),

                    agents_that_can_see_ids: props.agents_that_can_see_ids
                        ? props.agents_that_can_see_ids.map((agent_that_can_see_id) =>
                              StringValueObject.create(
                                  "agent_that_can_see_id",
                                  agent_that_can_see_id
                              )
                          )
                        : undefined,

                    pvp: NumberValueObject.createOptional("pvp", props.pvp),

                    app_contact_form: BooleanValueObject.createOptional(
                        "app_contact_form",
                        props.app_contact_form
                    ),

                    housing_id: UUID.create("housing_id", props.housing_id),

                    event_categories: props.event_categories
                        ? props.event_categories.map((extra_category) => {
                              const [result, error] = EventCategory.create(extra_category);
                              if (error) {
                                  console.debug(error);
                                  throw new Error("Error creating event categories");
                              }
                              return result;
                          })
                        : undefined,
                }),
                null,
            ];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
