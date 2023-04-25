import {Entity} from "./Entity";
import {Activity, ActivityBuilder} from "./Activity";
import {Expose, Transform, Type} from "class-transformer";
import Location, {LocationBuilder} from "./Location";

export module BillConstant {
    export const TABLE_NAME: string = 't_bills';
    export const C_BILL_ID: string = 'c_bill_id';
    export const C_BILL_NAME: string = 'c_bill_name';
    export const C_BILL_AMOUNT: string = 'c_bill_amount';
    export const C_BILL_DATE: string = 'c_bill_date';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const C_DESCRIPTION: string = 'c_description';
    export const F_ACTIVITY_ID: string = 'f_activity_id';
    export const F_LOCATION_ID: string = 'f_location_id';
}

export class Bill implements Entity {

    private _billId: string;
    private _billName: string;
    private _billAmount: number | null;
    private _billDate: Date;
    private _insertTime: Date;
    private _location: Location | null;
    private _activity: Activity | null;
    private _description: string | null;

    constructor() {
        this._billId = '';
        this._billName = '';
        this._billAmount = 0;
        this._billDate = new Date();
        this._insertTime = new Date();
        this._location = null;
        this._activity = null;
        this._description = null;
    }

    @Expose({name: BillConstant.C_BILL_ID})
    get billId(): string {
        return this._billId;
    }

    @Expose({name: BillConstant.C_BILL_NAME})
    get billName(): string {
        return this._billName;
    }

    @Expose({name: BillConstant.C_BILL_AMOUNT})
    get billAmount(): number | null {
        return this._billAmount;
    }

    @Expose({name: BillConstant.C_BILL_DATE})
    @Type(() => Date)
    get billDate(): Date {
        return this._billDate;
    }

    @Expose({name: BillConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }


    @Expose({name: BillConstant.C_DESCRIPTION})
    get description(): string | null {
        return this._description;
    }

    @Expose({name: BillConstant.F_LOCATION_ID})
    @Transform((params) => {
        new LocationBuilder().locationId(params.value).build();
    })
    get location(): Location | null {
        return this._location;
    }

    @Expose({name: BillConstant.F_ACTIVITY_ID})
    @Transform((params) => {
        new ActivityBuilder().activityId(params.value).build();
    })
    get activity(): Activity | null {
        return this._activity;
    }

    set activity(value: Activity | null) {
        this._activity = value;
    }

    set billId(value: string) {
        this._billId = value;
    }

    set billName(value: string) {
        this._billName = value;
    }

    set billAmount(value: number | null) {
        this._billAmount = value;
    }

    set billDate(value: Date) {
        this._billDate = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }

    set description(value: string | null) {
        this._description = value;
    }

    set location(value: Location | null) {
        this._location = value;
    }
}

export class BillBuilder {
    private readonly bill: Bill;
    constructor() {
        this.bill = new Bill();
    }

    billId(billId: string): BillBuilder {
        this.bill.billId = billId;
        return this;
    }

    billName(billName: string): BillBuilder {
        this.bill.billName = billName;
        return this;
    }

    billAmount(amount: number): BillBuilder {
        this.bill.billAmount = amount;
        return this;
    }

    billDate(billDate: Date): BillBuilder {
        this.bill.billDate = billDate;
        return this;
    }

    activity(activity: Activity): BillBuilder {
        this.bill.activity = activity;
        return this;
    }

    location(location: Location): BillBuilder {
        this.bill.location = location;
        return this;
    }

    description(description: string | null): BillBuilder {
        this.bill.description = description;
        return this;
    }

    build(): Bill {
        return this.bill;
    }
}
