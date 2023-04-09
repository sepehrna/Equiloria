import CommandBuilder from "../command-builders/CommandBuilder";
import DmlBuilder from "../command-builders/dml/DmlBuilder";
import DdlBuilder from "../command-builders/ddl/DdlBuilder";
import {DqlBuilder} from "../command-builders/dql/DqlBuilder";

export default interface CommandExecutor {

    execute(commandBuilder: CommandBuilder) : Promise<any>

}