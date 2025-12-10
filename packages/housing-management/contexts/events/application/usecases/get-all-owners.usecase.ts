import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type GetAllOwnersInput = {
    search?: string;
    is_reserved?: boolean;
    property_type?: string;
    premise_id?: string;
    page?: number;
    perPage?: number;
};

export function getAllOwnersBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<GetAllOwnersInput, Maybe<any>> {
    return async function getAllOwners({
        input,
        executedBy,
    }: UseCaseRequest<GetAllOwnersInput>): Promise<Maybe<any>> {
        return await housingRepository.getAllOwners(input, executedBy);
    };
}
