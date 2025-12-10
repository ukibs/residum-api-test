export abstract class ValueObject<Properties> {
    protected readonly props: Properties;

    protected constructor(props: Properties) {
        this.props = { ...props };
    }
}
