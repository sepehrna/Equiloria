import DmlBuilder from "../../sql-components/command-builders/dml/DmlBuilder";
import CommandAggregator from "./CommandAggregator";

export default class DmlCommandAggregator implements CommandAggregator<DmlBuilder> {

    private readonly transactionalCommands: DmlBuilder[];

    constructor() {
        this.transactionalCommands = [];
    }

    public command(command: DmlBuilder): void {
        this.transactionalCommands.push(command);
    }

    public commands<T extends DmlBuilder>(commands: CommandAggregator<T>): void {
        this.transactionalCommands.push(...commands.aggregate());
    }

    public aggregate(): DmlBuilder[] {
        return this.transactionalCommands;
    }

}