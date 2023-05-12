import {ValidatorResponse} from "../services/IValidator";

export function isValidatorResponse(obj: any): obj is ValidatorResponse {
    return obj && typeof obj.validationResult === 'boolean' &&
        (obj.validationExceptionMessage === null || typeof obj.validationExceptionMessage === 'string');
}