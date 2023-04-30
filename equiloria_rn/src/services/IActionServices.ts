import {Activity} from "../model/entities/Activity";
import {Bill} from "../model/entities/Bill";
import {ValidatorResponse} from "./IValidator";


export module IActionServiceServiceDefinition {
    export const ACTION_SERVICE_NAME: string = 'IActionServices'
}
export default interface IActionServices {

    fetchAllActivities(): Promise<Activity[]>;

    registerNewActivity(activity: Activity): Promise<void | ValidatorResponse>;

    insertActivity(activity: Activity): Promise<void | ValidatorResponse>

    updateActivity(activity: Activity): Promise<void | ValidatorResponse>;

    getActivityData(activityId: string): Promise<Activity | null>;

    registerNewBill(newBill: Bill): Promise<void | ValidatorResponse>;

    updateBill(bill: Bill): Promise<void | ValidatorResponse>;

    fetchAllBills(): Promise<Bill[]>;

    getBillData(billId: string): Promise<Bill | null>;


}