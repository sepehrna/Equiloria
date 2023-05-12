import {Bill} from "../../model/entities/Bill";
import {ActivityParticipant} from "../../model/entities/ActivityParticipants";
import {ValidatorResponse} from "../IValidator";

export default class CalculationValidatorUtil {

    public static validate(bills: Bill[], participants: ActivityParticipant[]): ValidatorResponse {
        let billsTotalAmount: number = CalculationValidatorUtil.calculateBillsTotalAmount(bills);
        let spentTotalAmount: number = CalculationValidatorUtil.calculateParticipantSpentTotalAmount(participants);
        if (billsTotalAmount !== spentTotalAmount) {
            return {
                validationResult: false,
                validationExceptionMessage: 'Total amount of bills is ' + billsTotalAmount + ' and total amount of spent is ' + spentTotalAmount + '. These amounts must be equal'
            };
        }
        return {validationResult: true, validationExceptionMessage: null};
    }

    private static calculateBillsTotalAmount(bills: Bill[]): number {
        let totalAmount: number = 0;
        for (let i = 0; i < bills.length; i++) {
            totalAmount += +bills[i].billAmount;
        }
        return totalAmount;
    }

    private static calculateParticipantSpentTotalAmount(participants: ActivityParticipant[]): number {
        let totalAmount: number = 0;
        for (let i = 0; i < participants.length; i++) {
            totalAmount += +participants[i].spentAmount;
        }
        return totalAmount;
    }
}