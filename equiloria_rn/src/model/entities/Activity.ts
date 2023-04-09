import {v4 as generateUuid} from 'uuid'
import {Entity} from './Entity'
import {Bill, BillBuilder} from "./Bill"


export class Activity implements Entity {

    private readonly _activityId: string
    private _activityName: string
    private _activityDate: Date
    private _insertTime: Date
    private _bills: Bill[]

    constructor() {
        this._activityId = generateUuid()
        this._activityName = ''
        this._activityDate = new Date()
        this._insertTime = new Date()
        this._bills = []
    }

    get activityId(): string {
        return this._activityId;
    }

    get activityName(): string {
        return this._activityName;
    }

    get activityDate(): Date {
        return this._activityDate;
    }

    get insertTime(): Date {
        return this._insertTime;
    }

    get bills(): Bill[] {
        return this._bills;
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
    private readonly activity: Activity

    constructor() {
        this.activity = new Activity()
    }
    activityName(activityName: string): ActivityBuilder {
        this.activity.activityName = activityName
        return this
    }
    activityDate(activityDate: Date): ActivityBuilder {
        this.activity.activityDate = activityDate
        return this
    }
    bill(bill: BillBuilder): ActivityBuilder {
        this.activity.bills.push(bill.build())
        return this
    }
    build(): Activity {
        return this.activity
    }
}


