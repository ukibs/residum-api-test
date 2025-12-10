import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { Entity, Primitives } from "../../../../../shared/contexts/domain/models/entity";
import {
    DatetimeValueObject,
    StringValueObject,
    UUID,
} from "../../../../../shared/contexts/domain/value-objects";
import { isNil } from "../../../../../shared/utils/type-checkers";

export type OwnerProperties = {
    id: UUID;
    premise_id: StringValueObject;
    name: StringValueObject;
    surname: StringValueObject;
    email: StringValueObject;
    phone: StringValueObject;
    iban: StringValueObject;
    bic: StringValueObject;
    created_at?: DatetimeValueObject;
    last_modified_at?: DatetimeValueObject;
};

export class Owner extends Entity<OwnerProperties> {
    public get value(): Primitives<OwnerProperties> {
        return {
            id: this.props.id.value,
            premise_id: this.props.premise_id.value,
            name: this.props.name.value,
            surname: this.props.surname.value,
            email: this.props.email.value,
            phone: this.props.phone.value,
            iban: this.props.iban.value,
            bic: this.props.bic.value,
            created_at: this.props.created_at?.value,
            last_modified_at: this.props.last_modified_at?.value,
        };
    }

    public static create(props: Primitives<OwnerProperties>): Maybe<Owner> {
        try {
            console.debug("Creating housing from props: ", props);
            return [
                new Owner({
                    id: UUID.create("id", props.id),
                    premise_id: StringValueObject.create("premise_id", props.premise_id),
                    name: StringValueObject.create("name", props.name),
                    surname: StringValueObject.create("surname", props.surname),
                    email: StringValueObject.create("email", props.email),
                    phone: StringValueObject.create("phone", props.phone),
                    iban: StringValueObject.create("iban", props.iban),
                    bic: StringValueObject.create("bic", props.bic),
                    created_at: DatetimeValueObject.createOptional("created_at", props.created_at),
                    last_modified_at: DatetimeValueObject.createOptional(
                        "last_modified_at",
                        props.last_modified_at
                    ),
                }),
                null,
            ];
        } catch (error) {
            return [null, error as Error];
        }
    }
}
