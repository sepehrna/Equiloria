import {Expose, Type} from "class-transformer";

export module LocationConstant {
    export const TABLE_NAME: string = 't_locations';
    export const C_LOCATION_ID: string = 'c_location_id';
    export const C_LATITUDE: string = 'c_latitude';
    export const C_LONGITUDE: string = 'c_longitude';
    export const C_INSERT_TIME: string = 'c_insert_time';

}
export default class Location {

    private _locationId: string;
    private _latitude: number;
    private _longitude: number;
    private _insertTime: Date;


    constructor() {
        this._locationId = '';
        this._longitude = 0;
        this._latitude = 0;
        this._insertTime = new Date();
    }


    @Expose({name: LocationConstant.C_LOCATION_ID})
    get locationId(): string {
        return this._locationId;
    }

    @Expose({name: LocationConstant.C_LATITUDE})
    get latitude(): number {
        return this._latitude;
    }

    @Expose({name: LocationConstant.C_LONGITUDE})
    get longitude(): number {
        return this._longitude;
    }


    @Expose({name: LocationConstant.C_INSERT_TIME})
    @Type(() => Date)
    get insertTime(): Date {
        return this._insertTime;
    }

    set locationId(value: string) {
        this._locationId = value;
    }

    set latitude(value: number) {
        this._latitude = value;
    }

    set longitude(value: number) {
        this._longitude = value;
    }


    set insertTime(value: Date) {
        this._insertTime = value;
    }
}

export class LocationBuilder {
    private readonly location: Location;

    constructor() {
        this.location = new Location();
    }

    locationId(locationId: string): LocationBuilder {
        this.location.locationId = locationId;
        return this;
    }

    latitude(latitude: number): LocationBuilder {
        this.location.latitude = latitude;
        return this;
    }

    longitude(longitude: number): LocationBuilder {
        this.location.longitude = longitude;
        return this;
    }

    build(): Location {
        return this.location;
    }
}