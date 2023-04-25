import {Activity} from "../model/entities/Activity";
import {Bill} from "../model/entities/Bill";

export const actionServicesInterfaceName: string = 'IActionService'
export default interface IActionService {

    fetchAllActivities(): Promise<Activity[]>;

    getActivityData(activityId: string): Promise<Activity | null>;

    registerNewBill(newBill: Bill): Promise<void>;

    fetchAllBills(): Promise<Bill[]>;

    getBillData(billId: string): Promise<Bill | null>;


}