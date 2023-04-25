import {IValidator, ValidatorResponse} from "./IValidator";
import {Bill} from "../model/entities/Bill";

class BillValidator implements IValidator<Bill> {
    public static billValidatorName = 'BillValidator';
    validateInsert(bill: Bill): ValidatorResponse {
        if (bill.billName == null) {
            return {validationResult: false, validationExceptionMessage: 'Bill name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

    validateUpdate(bill: Bill): ValidatorResponse {
        if (bill.billId == null) {
            return {validationResult: false, validationExceptionMessage: 'For updating a bill, bill id cannot be null'};
        }
        if (bill.billName == null) {
            return {validationResult: false, validationExceptionMessage: 'Bill name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

}

export default BillValidator;