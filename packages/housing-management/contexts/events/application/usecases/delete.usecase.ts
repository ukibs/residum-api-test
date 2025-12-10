import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type DeleteHousingInput = {
    id: string;
    // housing: Primitives<HousingProperties>;
    // event: Primitives<EventProperties>;
};

export function deleteHousingBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<DeleteHousingInput, Maybe<any>> {
    return async function deleteHousing({
        input,
    }: UseCaseRequest<DeleteHousingInput>): Promise<Maybe<any>> {
        return await housingRepository.delete(input.id);
    };
}
