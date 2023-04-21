import {Entity} from "./Entity";
import {ActionObject} from "./ActionObject";
import {Expose, Type} from "class-transformer";
import {UserAction} from "./UserAction";

export module EventConstant {
    export const TABLE_NAME: string = 't_events';
    export const C_EVENT_ID: string = 'c_event_id';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_USER_ACTION_ID: string = 'f_user_action_id';
}

export class Event implements Entity {
    private _eventId: string;
    private _insertTime: Date;
    private _userAction: UserAction | null;

    constructor() {
        this._eventId = '';
        this._insertTime = new Date();
        this._userAction = null;
    }

    @Expose({name: EventConstant.C_EVENT_ID})
    get eventId(): string {
        return this._eventId;
    }

    @Expose({name: EventConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    @Expose({name: EventConstant.F_USER_ACTION_ID})
    @Type(() => ActionObject)
    get userAction(): UserAction | null {
        return this._userAction;
    }

    set eventId(value: string) {
        this._eventId = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }

    set userAction(value: UserAction | null) {
        this._userAction = value;
    }
}

export class EventBuilder {
    private readonly event: Event;

    constructor() {
        this.event = new Event();
    }

    eventId(eventId: string): EventBuilder {
        this.event.eventId = eventId;
        return this;
    }

    insertTime(insertTime: Date): EventBuilder {
        this.event.insertTime = insertTime;
        return this;
    }

    userAction(userAction: UserAction): EventBuilder {
        this.event.userAction = userAction;
        return this;
    }

    build(): Event {
        return this.event;
    }
}