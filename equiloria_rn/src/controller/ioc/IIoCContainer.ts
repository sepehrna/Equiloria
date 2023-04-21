export default interface IIoCContainer {

    register<T>(name: string, instance: T): void;

    resolve<T>(name: string): T;

}