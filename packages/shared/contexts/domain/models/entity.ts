type PrimitiveTypes = string | number | boolean | Date | undefined | null;

type ValueObjectValue<Property> = Property extends PrimitiveTypes
    ? Property
    : Property extends { value: infer V }
    ? ValueObjectValue<V>
    : Property extends Array<infer V>
    ? Array<ValueObjectValue<V>>
    : Property extends object
    ? { [K in keyof Property]: ValueObjectValue<Property[K]> }
    : never;

export type Primitives<Properties> = {
    [key in keyof Properties]: ValueObjectValue<Properties[key]>;
};

export abstract class Entity<Properties> {
    protected readonly props: Properties;

    protected constructor(props: Properties) {
        this.props = props;
    }

    public abstract get value(): Primitives<Properties>;
}
