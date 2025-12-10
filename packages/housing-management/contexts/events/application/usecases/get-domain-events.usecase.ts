import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type GetDomainEventsInput = {
    category_id?: string;
    subcategory_id?: string;
    domain?: string;
    search?: string;
    is_reserved?: boolean;
    property_type?: string;
    premise_id?: string;
    distance_to_center?: string;
    page?: number;
    perPage?: number;
};

export function getDomainEventsBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<GetDomainEventsInput, Maybe<any>> {
    return async function getDomainEvents({
        input,
        executedBy,
    }: UseCaseRequest<GetDomainEventsInput>): Promise<Maybe<any>> {
        return await housingRepository.getDomainEvents(input);
    };
}
