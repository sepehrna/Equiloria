import {IValidator, ValidatorResponse} from "./IValidator";
import {Participant} from "../model/entities/Participant";

class ParticipantValidator implements IValidator<Participant> {
    public static participantValidatorName = 'BillValidator';

    validateInsert(participant: Participant): ValidatorResponse {
        if (participant.participantName == null) {
            return {validationResult: false, validationExceptionMessage: 'Participant name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

    validateUpdate(participant: Participant): ValidatorResponse {
        if (participant.participantName == null) {
            return {validationResult: false, validationExceptionMessage: 'Participant name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

}

export {ParticipantValidator}
