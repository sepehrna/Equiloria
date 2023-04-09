// SqliteInMemoryCommandExecutor.ts
import * as SQLite from "expo-sqlite";
import CommandExecutor from "./CommandExecutor";
import {DqlBuilder} from "../command-builders/dql/DqlBuilder";
import DmlBuilder from "../command-builders/dml/DmlBuilder";
import DdlBuilder from "../command-builders/ddl/DdlBuilder";
import CommandBuilder from "../command-builders/CommandBuilder";

export default class SqliteInMemoryCommandExecutor implements CommandExecutor {
    private static instance: SqliteInMemoryCommandExecutor;
    private database: SQLite.WebSQLDatabase | null = null;

    public static getInstance(): SqliteInMemoryCommandExecutor {
        if (!SqliteInMemoryCommandExecutor.instance) {
            SqliteInMemoryCommandExecutor.instance = new SqliteInMemoryCommandExecutor();
        }
        return SqliteInMemoryCommandExecutor.instance;
    }

    public open(): SQLite.WebSQLDatabase {
        if (this.database) {
            return this.database;
        }
        this.database = SQLite.openDatabase("eq_memory.db");
        return this.database;
    }

    public async execute(commandBuilder: CommandBuilder): Promise<any> {
        try {
            if (commandBuilder instanceof DmlBuilder) {
                await this.executeTransactionalCommand(commandBuilder);
            } else if (commandBuilder instanceof DqlBuilder) {
                await this.executeNonTransactionalCommand(commandBuilder);
            } else if (commandBuilder instanceof DdlBuilder) {
                await this.executeNonTransactionalCommand(commandBuilder);
            }
        } catch (error) {
            console.error(error);
        }
    }

    private async executeTransactionalCommand(commandBuilder: DmlBuilder): Promise<any> {
        const db = this.open();
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    let sqlStatement = commandBuilder.build();
                    console.info(sqlStatement)
                    tx.executeSql(
                        sqlStatement,
                        [],
                        (_, resultSet) => resolve(resultSet),
                        (_, error) => {
                            reject(error);
                            return true;
                        }
                    );
                },
                (error) => reject(error)
            );
        });
    }

    private async executeNonTransactionalCommand(commandBuilder: DdlBuilder | DqlBuilder): Promise<any> {
        const db = this.open();
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    let sqlStatement = commandBuilder.build();
                    console.info(sqlStatement)
                    tx.executeSql(
                        sqlStatement,
                        [],
                        (_, resultSet) => resolve(resultSet),
                        (_, error) => {
                            reject(error);
                            return true;
                        }
                    );
                },
                (error) => reject(error)
            );
        });
    }
}
