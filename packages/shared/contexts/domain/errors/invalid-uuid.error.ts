export class InvalidUuidError extends Error {
    constructor(uuid: string) {
        super(
            `UUID <${uuid}> don't satisfy pattern /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.`
        );
        this.name = "InvalidUuidError";
    }
}
