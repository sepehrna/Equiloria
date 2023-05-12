import {Expose, Type} from "class-transformer";
import {Entity} from "./Entity";

export module ActivityParticipantConstant {
    export const TABLE_NAME: string = 't_activity_participants';
    export const C_ACTIVITY_PARTICIPANT_ID: string = 'c_activity_participant_id';
    export const C_SPENT_AMOUNT: string = 'c_spent_amount';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_PARTICIPANT_ID: string = 'f_participant_id';
    export const F_ACTIVITY_ID: string = 'f_activity_id';

}

export class ActivityParticipant implements Entity {

    private _activityParticipantId: string;
    private _spentAmount: number;
    private _participantId: string;
    private _activityId: string;
    private _insertTime: Date;

    constructor() {
        this._activityParticipantId = '';
        this._spentAmount = 0;
        this._participantId = '';
        this._activityId = '';
        this._insertTime = new Date();
    }

    @Expose({name: ActivityParticipantConstant.C_ACTIVITY_PARTICIPANT_ID})
    get activityParticipantId(): string {
        return this._activityParticipantId;
    }

    @Expose({name: ActivityParticipantConstant.C_SPENT_AMOUNT})
    get spentAmount(): number {
        return this._spentAmount;
    }

    @Expose({name: ActivityParticipantConstant.F_PARTICIPANT_ID})
    get participantId(): string {
        return this._participantId;
    }

    @Expose({name: ActivityParticipantConstant.F_ACTIVITY_ID})
    get activityId(): string {
        return this._activityId;
    }

    @Expose({name: ActivityParticipantConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    set activityParticipantId(value: string) {
        this._activityParticipantId = value;
    }

    set spentAmount(value: number) {
        this._spentAmount = value;
    }

    set participantId(value: string) {
        this._participantId = value;
    }

    set activityId(value: string) {
        this._activityId = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }
}

export class ActivityParticipantBuilder {
    private readonly activityParticipant: ActivityParticipant;

    constructor() {
        this.activityParticipant = new ActivityParticipant();
    }

    participantId(participant: string): ActivityParticipantBuilder {
        this.activityParticipant.participantId = participant;
        return this;
    }

    spentAmount(spentAmount: number): ActivityParticipantBuilder {
        this.activityParticipant.spentAmount = spentAmount;
        return this;
    }

    activityId(activity: string): ActivityParticipantBuilder {
        this.activityParticipant.activityId = activity;
        return this;
    }

    build(): ActivityParticipant {
        return this.activityParticipant;
    }
}