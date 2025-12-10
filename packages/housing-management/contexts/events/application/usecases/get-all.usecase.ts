import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type GetAllHousingInput = {
    search?: string;
    is_reserved?: boolean;
    property_type?: string;
    premise_id?: string;
    page?: number;
    perPage?: number;
    asc?: string;
    desc?: string;
};

export function getAllHousingBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<GetAllHousingInput, Maybe<any>> {
    return async function getAllHousing({
        input,
        executedBy,
    }: UseCaseRequest<GetAllHousingInput>): Promise<Maybe<any>> {
        return await housingRepository.getAll(input, executedBy);
    };
}
