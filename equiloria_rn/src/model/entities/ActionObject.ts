import {Entity} from "./Entity";
import {Activity, ActivityBuilder} from "./Activity";
import {Bill, BillBuilder} from "./Bill";
import {Expose, Transform, Type} from "class-transformer";

export module ActionObjectConstant {
    export const TABLE_NAME: string = 't_action_objects';
    export const C_ACTION_OBJECT_ID: string = 'c_action_object_id';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_ACTIVITY_ID: string = 'f_activity_id';
    export const F_BILL_ID: string = 'f_bill_id';
}

export class ActionObject implements Entity {
    private _actionObjectId: string;
    private _insertTime: Date;
    private _activity: Activity | null;
    private _bill: Bill | null;

    constructor() {
        this._actionObjectId = '';
        this._insertTime = new Date();
        this._activity = null;
        this._bill = null;
    }

    // @Expose({name: ActionObjectConstant.C_ACTION_OBJECT_ID})
    get actionObjectId(): string {
        return this._actionObjectId;
    }

    // @Expose({name: ActionObjectConstant.C_INSERT_TIME})
    // @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    // @Expose({name: ActionObjectConstant.F_ACTIVITY_ID})
    // @Transform((params) => {
    //     new ActivityBuilder().activityId(params.value).build();
    // })
    get activity(): Activity | null {
        return this._activity;
    }

    // @Expose({name: ActionObjectConstant.F_BILL_ID})
    // @Transform((params) => {
    //     new BillBuilder().billId(params.value).build();
    // })
    get bill(): Bill | null {
        return this._bill;
    }

    set actionObjectId(value: string) {
        this._actionObjectId = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }

    set activity(value: Activity | null) {
        this._activity = value;
    }

    set bill(value: Bill | null) {
        this._bill = value;
    }
}

export class ActionObjectBuilder {
    private readonly actionObject: ActionObject;

    constructor() {
        this.actionObject = new ActionObject();
    }

    actionObjectId(actionObjectId: string): ActionObjectBuilder {
        this.actionObject.actionObjectId = actionObjectId;
        return this;
    }

    insertTime(insertTime: Date): ActionObjectBuilder {
        this.actionObject.insertTime = insertTime;
        return this;
    }

    activity(activity: Activity): ActionObjectBuilder {
        this.actionObject.activity = activity;
        return this;
    }

    bill(bill: Bill): ActionObjectBuilder {
        this.actionObject.bill = bill;
        return this;
    }

    build(): ActionObject {
        return this.actionObject;
    }
}

