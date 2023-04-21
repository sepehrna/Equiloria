import {Entity} from "./Entity";
import {ActionObject} from "./ActionObject";
import {Expose, Transform, Type} from "class-transformer";
import {ActivityBuilder} from "./Activity";

export module UserActionConstant {
    export const TABLE_NAME: string = 't_user_actions';
    export const C_USER_ACTION_ID: string = 'c_user_action_id';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_ACTION_OBJECT_ID: string = 'f_action_object_id';
}

export class UserAction implements Entity {
    private _userActionId: string;
    private _insertTime: Date;
    private _actionObject: ActionObject;

    constructor() {
        this._userActionId = '';
        this._insertTime = new Date();
        this._actionObject = new ActionObject();
    }

    @Expose({name: UserActionConstant.C_USER_ACTION_ID})
    get userActionId(): string {
        return this._userActionId;
    }

    @Expose({name: UserActionConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    @Expose({name: UserActionConstant.F_ACTION_OBJECT_ID})
    @Transform((params) => {
        new ActivityBuilder().activityId(params.value).build();
    })
    get actionObject(): ActionObject {
        return this._actionObject;
    }

    set userActionId(value: string) {
        this._userActionId = value;
    }

    set insertTime(value: Date) {
        this._insertTime = value;
    }

    set actionObject(value: ActionObject) {
        this._actionObject = value;
    }
}

export class UserActionsBuilder {
    private readonly userActions: UserAction;

    constructor() {
        this.userActions = new UserAction();
    }

    userActionId(userActionId: string): UserActionsBuilder {
        this.userActions.userActionId = userActionId;
        return this;
    }

    insertTime(insertTime: Date): UserActionsBuilder {
        this.userActions.insertTime = insertTime;
        return this;
    }

    actionObject(actionObject: ActionObject): UserActionsBuilder {
        this.userActions.actionObject = actionObject;
        return this;
    }

    build(): UserAction {
        return this.userActions;
    }
}
