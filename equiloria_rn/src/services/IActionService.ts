import {Activity} from "../model/entities/Activity";
import {Bill} from "../model/entities/Bill";

export default interface IActionService {

    fetchAllActivities(): Promise<Activity[]>;

    getActivityData(): Promise<Activity>;

    fetchUnGroupedBills(): Promise<Bill[]>;

    getBillData(billId: string): Promise<Bill>;


}