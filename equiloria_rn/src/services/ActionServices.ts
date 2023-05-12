import IActionServices from "./IActionServices";
import {Activity} from "../model/entities/Activity";
import ActivityRepository from "../model/repositories/ActivityRepository";
import BillRepository from "../model/repositories/BillRepository";
import {Bill} from "../model/entities/Bill";
import BillValidator from "./BillValidator";
import {ValidatorResponse} from "./IValidator";
import ActivityValidator from "./ActivityValidator";
import {ParticipantValidator} from "./ParticipantValidator";
import ParticipantRepository from "../model/repositories/ParticipantRepository";
import ActivityParticipantRepository from "../model/repositories/ActivityParticipantRepository";
import {Participant} from "../model/entities/Participant";
import {ActivityParticipant} from "../model/entities/ActivityParticipants";
import CalculationValidatorUtil from "./calculator/CalculationValidator";
import {ParticipantBalanceListContainer} from "./calculator/ParticipantBalanceListContainer";
import {TransactionListContainer} from "./calculator/TransactionListContainer";
import {PayFlowCalculator} from "./calculator/PayFlowCalculator";
import Transaction from "./calculator/Transaction";

class ActionServices implements IActionServices {

    private activityRepository: ActivityRepository;
    private activityValidator: ActivityValidator;
    private participantValidator: ParticipantValidator;
    private billRepository: BillRepository;
    private billValidator: BillValidator;
    private participantRepository: ParticipantRepository;
    private activityParticipantRepository: ActivityParticipantRepository;

    constructor(activityRepository: ActivityRepository, activityValidator: ActivityValidator, participantValidator: ParticipantValidator, billRepository: BillRepository, billValidator: BillValidator, participantRepository: ParticipantRepository, activityParticipantRepository: ActivityParticipantRepository) {
        this.activityRepository = activityRepository;
        this.activityValidator = activityValidator;
        this.participantValidator = participantValidator;
        this.billRepository = billRepository;
        this.billValidator = billValidator;
        this.participantRepository = participantRepository;
        this.activityParticipantRepository = activityParticipantRepository;
    }

    fetchAllActivities(): Promise<Activity[]> {
        return this.activityRepository.findAll();
    }

    async registerNewActivity(activity: Activity): Promise<string | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateInsert(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    async insertActivity(activity: Activity): Promise<string | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateInsert(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    async updateActivity(activity: Activity): Promise<string | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.activityValidator.validateUpdate(activity);
        if (validatorResponse.validationResult) {
            return await this.activityRepository.persist(activity);
        }
        return validatorResponse;
    }

    getActivityData(activityId: string): Promise<Activity | null> {
        return this.activityRepository.findById(activityId);
    }

    async findUnAssignedBills(): Promise<Bill[]> {
        let result: Bill[] = [];
        let bills: Bill[] | null = await this.billRepository.findUnAssignedBills();
        if (bills) {
            return bills;
        }
        return result;
    }

    fetchAllBills(): Promise<Bill[]> {
        return this.billRepository.findAll();
    }

    async registerNewBill(newBill: Bill): Promise<void | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.billValidator.validateInsert(newBill);
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

    getAllBillsOfActivity(activityId: string): Promise<Bill[]> {
        return this.billRepository.findByActivityId(activityId);
    }

    getBillData(billId: string): Promise<Bill | null> {
        return this.billRepository.findById(billId);
    }

    async registerNewParticipant(participant: Participant): Promise<string | ValidatorResponse> {
        let validatorResponse: ValidatorResponse = this.participantValidator.validateUpdate(participant);
        if (validatorResponse.validationResult) {
            let participantId: string | number[] = await this.participantRepository.insert(participant);
            if (typeof participantId == "string") {
                return participantId;
            }
        }
        return validatorResponse;
    }

    async connectParticipantToActivity(activityParticipant: ActivityParticipant): Promise<void | ValidatorResponse> {
        if (activityParticipant.participantId && activityParticipant.participantId !== ''
            && activityParticipant.activityId && activityParticipant.activityId !== '') {
            return await this.activityParticipantRepository.persist(activityParticipant);
        }
        return {validationResult: false, validationExceptionMessage: 'Activity or participant is not valid'};
    }

    async findActivityParticipants(activityId: string): Promise<Participant[]> {
        let result: Participant[] = [];
        let activityParticipants: ActivityParticipant[] | null = await this.activityParticipantRepository.findByActivityId(activityId);
        if (activityParticipants != null && activityParticipants.length > 0) {
            for (let i = 0; i < activityParticipants.length; i++) {
                let participant: Participant | null = await this.participantRepository.findById(activityParticipants[i].participantId);
                if (participant) {
                    result.push(participant);
                }
            }
        }
        return result;
    }

    async findNonRelatedActivityParticipants(activityId: string): Promise<Participant[]> {
        let participants: Participant[] | null = await this.participantRepository.findNotRelatedParticipants(activityId);
        if (participants) {
            return participants;
        }
        return [];
    }

    async getParticipant(participantId: string): Promise<Participant | null> {
        return await this.participantRepository.findById(participantId);
    }

    async calculateTransactions(activityId: string): Promise<Transaction[] | ValidatorResponse> {
        let foundActivity: Activity | null = await this.activityRepository.findById(activityId);
        if (foundActivity != null) {
            let activityParticipants: ActivityParticipant[] = await this.activityParticipantRepository.findByActivityId(activityId);
            let bills: Bill[] = await this.billRepository.findByActivityId(activityId);
            let validatorResponse: ValidatorResponse = CalculationValidatorUtil.validate(bills, activityParticipants);
            if (validatorResponse.validationResult) {
                let participantList: ParticipantBalanceListContainer = new ParticipantBalanceListContainer();
                let transactionList: TransactionListContainer = new TransactionListContainer();
                for (let i = 0; i < activityParticipants.length; i++) {
                    participantList.createNewParticipantBalance(+activityParticipants[i].spentAmount, activityParticipants[i].participantId);
                }
                PayFlowCalculator.execute(participantList, transactionList);
                return transactionList.getList();
            } else {
                return validatorResponse;
            }
        }
        return {validationResult: false, validationExceptionMessage: 'Activity not found'};
    }

}

export {ActionServices}