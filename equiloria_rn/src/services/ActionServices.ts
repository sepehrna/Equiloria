import IActionServices from "./IActionServices";
import {Activity} from "../model/entities/Activity";
import ActivityRepository from "../model/repositories/ActivityRepository";
import BillRepository from "../model/repositories/BillRepository";
import {Bill} from "../model/entities/Bill";
import BillValidator from "./BillValidator";
import {ValidatorResponse} from "./IValidator";
import ActivityValidator from "./ActivityValidator";

class ActionServices implements IActionServices {

    private activityRepository: ActivityRepository;
    private activityValidator: ActivityValidator;
    private billRepository: BillRepository;
    private billValidator: BillValidator;


    constructor(activityRepository: ActivityRepository, activityValidator: ActivityValidator, billRepository: BillRepository, billValidator: BillValidator) {
        this.activityRepository = activityRepository;
        this.activityValidator = activityValidator;
        this.billRepository = billRepository;
        this.billValidator = billValidator;
    }

    fetchAllActivities(): Promise<Activity[]> {
        return this.activityRepository.findAll();
    }

    async registerNewActivity(activity: Activity): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateInsert(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    async insertActivity(activity: Activity): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateInsert(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    async updateActivity(activity: Activity): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateUpdate(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    getActivityData(activityId: string): Promise<Activity | null> {
        return this.activityRepository.findById(activityId);
    }

    fetchAllBills(): Promise<Bill[]> {
        return this.billRepository.findAll();
    }

    async registerNewBill(newBill: Bill): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.billValidator.validateInsert(newBill);
        console.error('!!!!!!!!!!!!!!!!!!!++++++++++++++++++++++++++++');
        if (validatorResponse.validationResult) {
            return await this.billRepository.insert(newBill);
        }
        return validatorResponse;
    }

    async updateBill(bill: Bill): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.billValidator.validateUpdate(bill);
        if (validatorResponse.validationResult) {
            return await this.billRepository.update(bill);
        }
        return validatorResponse;
    }

    getBillData(billId: string): Promise<Bill | null> {
        return this.billRepository.findById(billId);
    }

}

export {ActionServices}