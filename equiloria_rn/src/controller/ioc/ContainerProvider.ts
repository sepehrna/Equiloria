import IIoCContainer from "./IIoCContainer";
import {DefaultIoCContainer} from "./DefaultIoCContainer";


export default class ContainerProvider {

    // Create a single IoC container instance
    private static _defaultDatabaseName: string = 'equiloria_db';
    private static defaultContainer: IIoCContainer = new DefaultIoCContainer(ContainerProvider._defaultDatabaseName);

    public static provide(): IIoCContainer {
        return this.defaultContainer;
    }

    static get defaultDatabaseName(): string {
        return this._defaultDatabaseName;
    }
}
