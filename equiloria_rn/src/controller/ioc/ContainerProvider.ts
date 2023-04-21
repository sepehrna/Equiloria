import IIoCContainer from "./IIoCContainer";
import {DefaultIoCContainer} from "./DefaultIoCContainer";


export default class ContainerProvider {

    // Create a single IoC container instance
    private static defaultContainer: IIoCContainer = new DefaultIoCContainer();

    public static provide(): IIoCContainer {
        return this.defaultContainer;
    }
}
