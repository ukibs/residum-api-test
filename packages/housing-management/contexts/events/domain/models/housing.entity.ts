import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import {
    BooleanValueObject,
    DatetimeValueObject,
    NumberValueObject,
    StringValueObject,
    UUID,
    UrlValueObject,
} from "../../../../../shared/contexts/domain/value-objects";
import { isNil } from "../../../../../shared/utils/type-checkers";

export type HousingProperties = {
    id: UUID;
    owner_id: UUID;
    premise_id: UUID;
    is_house: BooleanValueObject;
    category?: StringValueObject;
    property_type: StringValueObject;
    address: StringValueObject;
    tenants: NumberValueObject;
    area_m2: NumberValueObject;
    description: StringValueObject;
    price_monthly?: NumberValueObject;
    collect_by_platform: BooleanValueObject;
    quality_seal?: BooleanValueObject;
    visible?: BooleanValueObject;
    created_at?: DatetimeValueObject;
    last_modified_at?: DatetimeValueObject;
    main_image_url?: UrlValueObject;
    images_urls?: StringValueObject;
};

export class Housing extends Entity<HousingProperties> {
    public get value(): Primitives<HousingProperties> {
        return {
            id: this.props.id.value,
            owner_id: this.props.owner_id.value,
            premise_id: this.props.premise_id.value,
            is_house: this.props.is_house.value,
            category: this.props.category?.value,
            property_type: this.props.property_type.value,
            address: this.props.address.value,
            tenants: this.props.tenants.value,
            area_m2: this.props.area_m2.value,
            description: this.props.description.value,
            price_monthly: this.props.price_monthly?.value,
            collect_by_platform: this.props.collect_by_platform.value,
            quality_seal: this.props.quality_seal?.value,
            visible: this.props.visible?.value,
            created_at: this.props.created_at?.value,
            last_modified_at: this.props.last_modified_at?.value,
            main_image_url: this.props.main_image_url?.value,
            images_urls: this.props.images_urls?.value,
        };
    }

    public static create(props: Primitives<HousingProperties>): Maybe<Housing> {
        try {
            console.debug("Creating housing from props: ", props);
            return [
                new Housing({
                    id: UUID.create("id", props.id),
                    owner_id: UUID.create("owner_id", props.owner_id),
                    premise_id: UUID.create("premise_id", props.premise_id),
                    is_house: BooleanValueObject.create("is_house", props.is_house),
                    category: StringValueObject.createOptional("category", props.category),
                    property_type: StringValueObject.create("property_type", props.property_type),
                    address: StringValueObject.create("address", props.address),
                    tenants: NumberValueObject.create("tenants", props.tenants),
                    area_m2: NumberValueObject.create("area_m2", props.area_m2),
                    description: StringValueObject.create("description", props.description),
                    price_monthly: NumberValueObject.createOptional(
                        "price_monthly",
                        props.price_monthly
                    ),
                    collect_by_platform: BooleanValueObject.create(
                        "collect_by_platform",
                        props.collect_by_platform
                    ),
                    quality_seal: BooleanValueObject.createOptional(
                        "quality_seal",
                        props.quality_seal
                    ),
                    visible: BooleanValueObject.createOptional("visible", props.visible),
                    created_at: DatetimeValueObject.createOptional("created_at", props.created_at),
                    last_modified_at: DatetimeValueObject.createOptional(
                        "last_modified_at",
                        props.last_modified_at
                    ),
                    main_image_url: UrlValueObject.createOptional(
                        "main_image_url",
                        props.main_image_url
                    ),
                    images_urls: StringValueObject.createOptional("images_urls", props.images_urls),
                }),
                null,
            ];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
