import {Expose, Type} from "class-transformer";
import {Entity} from "./Entity";

export module ParticipantConstant {
    export const TABLE_NAME: string = 't_participants';
    export const C_PARTICIPANT_ID: string = 'c_participant_id';
    export const C_NAME: string = 'c_name';
    export const C_INSERT_TIME: string = 'c_insert_time';

}

export class Participant implements Entity {

    private _participantId: string;
    private _participantName: string;
    private _insertTime: Date;

    constructor() {
        this._participantId = '';
        this._participantName = '';
        this._insertTime = new Date();
    }

    @Expose({name: ParticipantConstant.C_PARTICIPANT_ID})
    get participantId(): string {
        return this._participantId;
    }

    @Expose({name: ParticipantConstant.C_NAME})
    get participantName(): string {
        return this._participantName;
    }

    @Expose({name: ParticipantConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    set participantId(value: string) {
        this._participantId = value;
    }

    set participantName(value: string) {
        this._participantName = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }
}

export class ParticipantBuilder {
    private readonly participant: Participant;

    constructor() {
        this.participant = new Participant();
    }

    participantId(participantId: string): ParticipantBuilder {
        this.participant.participantId = participantId;
        return this;
    }

    participantName(participantName: string): ParticipantBuilder {
        this.participant.participantName = participantName;
        return this;
    }

    build(): Participant {
        return this.participant;
    }
}