import {Entity} from './Entity'
import {Bill, BillBuilder} from "./Bill"
import {Expose} from "class-transformer";

export module ActivityConstant {
    export const TABLE_NAME: string = 't_activities';
    export const C_ACTIVITY_ID: string = 'c_activity_id';
    export const C_ACTIVITY_NAME: string = 'c_activity_name';
    export const C_ACTIVITY_DATE: string = 'c_activity_date';
    export const C_INSERT_TIME: string = 'c_insert_time';
}

export class Activity implements Entity {
    private _activityId: string
    private _activityName: string
    private _activityDate: Date
    private _insertTime: Date
    private _bills: Bill[]

    constructor() {
        this._activityId = ''
        this._activityName = ''
        this._activityDate = new Date()
        this._insertTime = new Date()
        this._bills = []
    }


    @Expose({name: ActivityConstant.C_ACTIVITY_ID})
    get activityId(): string {
        return this._activityId;
    }

    @Expose({name: ActivityConstant.C_ACTIVITY_NAME})
    get activityName(): string {
        return this._activityName;
    }

    @Expose({name: ActivityConstant.C_ACTIVITY_DATE})
    get activityDate(): Date {
        return this._activityDate;
    }

    @Expose({name: ActivityConstant.C_INSERT_TIME})
    get insertTime(): Date {
        return this._insertTime;
    }

    get bills(): Bill[] {
        return this._bills;
    }

    set activityId(value: string) {
        this._activityId = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }

    set activityName(value: string) {
        this._activityName = value
    }

    set activityDate(value: Date) {
        this._activityDate = value
    }

    set bills(value: Bill[]) {
        this._bills = value;
    }
}

export class ActivityBuilder {
    private readonly activity: Activity;

    constructor() {
        this.activity = new Activity();
    }

    activityId(activityId: string): ActivityBuilder {
        this.activity.activityId = activityId
        return this
    }

    activityName(activityName: string): ActivityBuilder {
        this.activity.activityName = activityName
        return this
    }

    activityDate(activityDate: Date): ActivityBuilder {
        this.activity.activityDate = activityDate
        return this
    }

    insertTime(insertTime: Date): ActivityBuilder {
        this.activity.insertTime = insertTime;
        return this;
    }

    bill(bill: BillBuilder): ActivityBuilder {
        this.activity.bills.push(bill.build())
        return this
    }

    build(): Activity {
        return this.activity
    }
}


