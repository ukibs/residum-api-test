import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type GetHousingByIdInput = {
    id: string;
    // housing: Primitives<HousingProperties>;
    // event: Primitives<EventProperties>;
};

export function getHousingByIdBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<GetHousingByIdInput, Maybe<any>> {
    return async function getHousingById({
        input,
    }: UseCaseRequest<GetHousingByIdInput>): Promise<Maybe<any>> {
        return await housingRepository.getById(input.id);
    };
}
