import { UseCase, UseCaseRequest } from "../../../../../shared/contexts/application/usecase";
import { Maybe } from "../../../../../shared/contexts/domain/errors";
import { HousingRepository } from "../../domain/contracts/housing.repository";

export type GetOwnerByIdInput = {
    id: string;
    // housing: Primitives<OwnerProperties>;
    // event: Primitives<EventProperties>;
};

export function getOwnerByIdBuilder({
    housingRepository,
}: {
    housingRepository: HousingRepository;
}): UseCase<GetOwnerByIdInput, Maybe<any>> {
    return async function getOwnerById({
        input,
    }: UseCaseRequest<GetOwnerByIdInput>): Promise<Maybe<any>> {
        return await housingRepository.getOwnerById(input.id);
    };
}
