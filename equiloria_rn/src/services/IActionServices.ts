import {Activity} from "../model/entities/Activity";
import {Bill} from "../model/entities/Bill";
import {ValidatorResponse} from "./IValidator";
import {Participant} from "../model/entities/Participant";
import {ActivityParticipant} from "../model/entities/ActivityParticipants";
import Transaction from "./calculator/Transaction";


export module IActionServiceServiceDefinition {
    export const ACTION_SERVICE_NAME: string = 'IActionServices'
}
export default interface IActionServices {

    fetchAllActivities(): Promise<Activity[]>;

    registerNewActivity(activity: Activity): Promise<string | ValidatorResponse>;

    insertActivity(activity: Activity): Promise<string | ValidatorResponse>

    updateActivity(activity: Activity): Promise<string | ValidatorResponse>;

    getActivityData(activityId: string): Promise<Activity | null>;

    findUnAssignedBills(): Promise<Bill[]>;

    registerNewBill(newBill: Bill): Promise<void | ValidatorResponse>;

    updateBill(bill: Bill): Promise<void | ValidatorResponse>;

    fetchAllBills(): Promise<Bill[]>;

    getAllBillsOfActivity(activityId: string): Promise<Bill[]>;

    getBillData(billId: string): Promise<Bill | null>;

    registerNewParticipant(participant: Participant): Promise<string | ValidatorResponse>;

    connectParticipantToActivity(activityParticipant: ActivityParticipant): Promise<void | ValidatorResponse>;

    findActivityParticipants(activityId: string): Promise<Participant[]>;

    findNonRelatedActivityParticipants(activityId: string): Promise<Participant[]>;

    getParticipant(participantId: string): Promise<Participant | null>;

    calculateTransactions(activityId: string): Promise<Transaction[] | ValidatorResponse>;
}