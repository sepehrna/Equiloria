import {Entity} from "./Entity";
import {Expose} from "class-transformer";

module ConsumptionTypeConstant {
    export const TABLE_NAME: string = 't_consumption_types';
    export const C_CONSUMPTION_TYPE_ID: string = 'c_consumption_type_id';
    export const C_CONSUMPTION_TYPE_NAME: string = 'c_consumption_type_name';
    export const C_INSERT_TIME: string = 'c_insert_time';

}

class ConsumptionType implements Entity {

    private _consumptionTypeId: string | null;
    private _consumptionTypeName: string | null;
    private _insertTime: Date | null;

    constructor() {
        this._consumptionTypeId = null;
        this._consumptionTypeName = null;
        this._insertTime = new Date();
    }

    @Expose({name: ConsumptionTypeConstant.C_CONSUMPTION_TYPE_ID})
    get consumptionTypeId(): string | null {
        return this._consumptionTypeId;
    }

    @Expose({name: ConsumptionTypeConstant.C_CONSUMPTION_TYPE_NAME})
    get consumptionTypeName(): string | null {
        return this._consumptionTypeName;
    }

    @Expose({name: ConsumptionTypeConstant.C_INSERT_TIME})
    get insertTime(): Date | null {
        return this._insertTime;
    }

    set consumptionTypeId(value: string | null) {
        this._consumptionTypeId = value;
    }

    set consumptionTypeName(value: string | null) {
        this._consumptionTypeName = value;
    }

    set insertTime(value: Date | null) {
        this._insertTime = value;
    }
}

class ConsumptionTypeBuilder {
    private readonly consumptionType: ConsumptionType;

    constructor() {
        this.consumptionType = new ConsumptionType();
    }

    consumptionTypeId(consumptionTypeId: string): ConsumptionTypeBuilder {
        this.consumptionType.consumptionTypeId = consumptionTypeId;
        return this;
    }

    consumptionTypeName(consumptionTypeName: string): ConsumptionTypeBuilder {
        this.consumptionType.consumptionTypeName = consumptionTypeName;
        return this;
    }


    build(): ConsumptionType {
        return this.consumptionType;
    }
}

export {ConsumptionTypeConstant, ConsumptionTypeBuilder}
export default ConsumptionType;