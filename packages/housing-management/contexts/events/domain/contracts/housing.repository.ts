import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { AuthorizedUserProperties } from "../../../../../shared/contexts/domain/models/authorized-user.entity";
import { Housing } from "../models/housing.entity";
import { Event } from "../models/event.entity";
import { Owner } from "../models/owner.entity";

export interface HousingRepository {
    // Housing
    create(
        owner: Owner,
        housing: Housing,
        parentEvent: Event,
        childEvents: Event[]
    ): Promise<Maybe<Housing>>;
    getAll(parameters: any, executedBy: AuthorizedUserProperties): Promise<Maybe<any>>;
    getById(id: string): Promise<Maybe<any>>;
    update(id: string, housing: Housing): Promise<Maybe<any>>;
    delete(id: string): Promise<Maybe<any>>;
    // Owners
    getAllOwners(parameters: any, executedBy: AuthorizedUserProperties): Promise<Maybe<any>>;
    getOwnerById(id: string): Promise<Maybe<any>>;
    updateOwner(id: string, housing: Owner): Promise<Maybe<any>>;
    // Events
    getDomainEvents(parameters: any): Promise<Maybe<any[]>>;
}
