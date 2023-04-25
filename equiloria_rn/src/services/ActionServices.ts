import IActionService from "./IActionService";
import {Activity} from "../model/entities/Activity";
import ActivityRepository from "../model/repositories/ActivityRepository";
import BillRepository from "../model/repositories/BillRepository";
import {Bill} from "../model/entities/Bill";
import BillValidator from "./BillValidator";
import {ValidatorResponse} from "./IValidator";

class ActionServices implements IActionService {

    private activityRepository: ActivityRepository;
    private billRepository: BillRepository;
    private billValidator: BillValidator;


    constructor(activityRepository: ActivityRepository, billRepository: BillRepository, billValidator: BillValidator) {
        this.activityRepository = activityRepository;
        this.billRepository = billRepository;
        this.billValidator = billValidator;
    }

    fetchAllActivities(): Promise<Activity[]> {
        return this.activityRepository.findAll();
    }

    getActivityData(activityId: string): Promise<Activity | null> {
        return this.activityRepository.findById(activityId);
    }

    fetchAllBills(): Promise<Bill[]> {
        return this.billRepository.findAll();
    }

    async registerNewBill(newBill: Bill): Promise<void> {
        let validatorResponse: ValidatorResponse = this.billValidator.validateInsert(newBill);
        if (validatorResponse.validationResult) {
            return await this.billRepository.insert(newBill);
        }
    }

    getBillData(billId: string): Promise<Bill | null> {
        return this.billRepository.findById(billId);
    }

}

export {ActionServices}