import CommandBuilder from "../../sql-components/command-builders/CommandBuilder";

export default interface CommandAggregator<T extends CommandBuilder> {

    command(command: T): void;

    aggregate(): T[];

}