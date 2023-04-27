import {Entity} from './Entity'
import {Bill, BillBuilder} from "./Bill"
import {Expose, Transform, Type} from "class-transformer";
import ConsumptionType from "./ConsumptionType";

export module ActivityConstant {
    export const TABLE_NAME: string = 't_activities';
    export const C_ACTIVITY_ID: string = 'c_activity_id';
    export const C_ACTIVITY_NAME: string = 'c_activity_name';
    export const C_FROM_DATE: string = 'c_from_date';
    export const C_TO_DATE: string = 'c_to_date';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_CONSUMPTION_TYPE: string = 'f_consumption_type';
}

export class Activity implements Entity {
    private _insertTime: Date;
    private _activityId: string;
    private _activityName: string;
    private _fromDate: Date | null;
    private _toDate: Date | null;
    private _consumptionType: ConsumptionType | null;
    private _bills: Bill[];

    constructor() {
        this._activityId = '';
        this._activityName = '';
        this._fromDate = null;
        this._toDate = null;
        this._insertTime = new Date();
        this._consumptionType = null;
        this._bills = [];
    }


    // @Expose({name: ActivityConstant.C_ACTIVITY_ID})
    get activityId(): string {
        return this._activityId;
    }

    // @Expose({name: ActivityConstant.C_ACTIVITY_NAME})
    get activityName(): string {
        return this._activityName;
    }


    // @Expose({name: ActivityConstant.C_FROM_DATE})
    // @Type(() => Date)
    get fromDate(): Date | null {
        return this._fromDate;
    }

    // @Expose({name: ActivityConstant.C_TO_DATE})
    // @Type(() => Date)
    get toDate(): Date | null {
        return this._toDate;
    }

    // @Expose({name: ActivityConstant.C_INSERT_TIME})
    get insertTime(): Date {
        return this._insertTime;
    }

    // @Expose({name: ActivityConstant.F_CONSUMPTION_TYPE})
    // @Transform((params) => {
    //     new ActivityBuilder().activityId(params.value).build();
    // })
    get consumptionType(): ConsumptionType | null {
        return this._consumptionType;
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

    set fromDate(value: Date | null) {
        this._fromDate = value;
    }

    set toDate(value: Date | null) {
        this._toDate = value
    }

    set consumptionType(value: ConsumptionType | null) {
        this._consumptionType = value;
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

    fromDate(fromDate: Date): ActivityBuilder {
        this.activity.fromDate = fromDate;
        return this;
    }

    toDate(toDate: Date): ActivityBuilder {
        this.activity.toDate = toDate
        return this
    }

    insertTime(insertTime: Date): ActivityBuilder {
        this.activity.insertTime = insertTime;
        return this;
    }

    consumptionType(consumptionType: ConsumptionType): ActivityBuilder {
        this.activity.consumptionType = consumptionType;
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


