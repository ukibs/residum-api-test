export class EntityNotExistsError extends Error {
    constructor(entityName: string, entityId: string) {
        super(`${entityName}(${entityId}) not found`);
        this.name = "EntityNotExistsError";
    }
}
