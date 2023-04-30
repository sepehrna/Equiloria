import {IValidator, ValidatorResponse} from "./IValidator";
import {Activity} from "../model/entities/Activity";

class ActivityValidator implements IValidator<Activity> {
    public static activityValidatorName = 'ActivityValidator';

    validateInsert(activity: Activity): ValidatorResponse {
        if (activity.activityName == null) {
            return {validationResult: false, validationExceptionMessage: 'Activity name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

    validateUpdate(bill: Activity): ValidatorResponse {
        if (bill.activityId == null) {
            return {validationResult: false, validationExceptionMessage: 'For updating a bill, bill id cannot be null'};
        }
        if (bill.activityName == null) {
            return {validationResult: false, validationExceptionMessage: 'Activity name cannot be empty'};
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

}

export default ActivityValidator;