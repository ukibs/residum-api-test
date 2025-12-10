export class EntityAlreadyExistsError extends Error {
    constructor(entityName: string, entityId: string) {
        super(`${entityName}(${entityId}) already exists`);
        this.name = "EntityAlreadyExistsError";
    }
}
