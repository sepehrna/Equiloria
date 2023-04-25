import {Entity} from "../model/entities/Entity";

type ValidatorResponse = {
    validationResult: boolean;
    validationExceptionMessage: string | null;
}

interface IValidator<T extends Entity> {
    validateInsert(t: T): ValidatorResponse;

    validateUpdate(t: T): ValidatorResponse;

}

export {IValidator, ValidatorResponse};