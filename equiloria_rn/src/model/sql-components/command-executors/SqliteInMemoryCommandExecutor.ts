import * as SQLite from "expo-sqlite";
import CommandExecutor from "./CommandExecutor";
import {DqlBuilder} from "../command-builders/dql/DqlBuilder";
import DmlBuilder from "../command-builders/dml/DmlBuilder";
import DdlBuilder from "../command-builders/ddl/DdlBuilder";
import CommandBuilder from "../command-builders/CommandBuilder";
import {Entity} from "../../entities/Entity";
import {SQLResultSet} from "expo-sqlite";
import {plainToInstance} from "class-transformer";
import {ClassConstructor} from "class-transformer/types/interfaces";

export default class SqliteInMemoryCommandExecutor implements CommandExecutor {
    private _database: SQLite.WebSQLDatabase | null = null;
    private readonly _dbName: string;

    constructor(dbName: string) {
        this._dbName = dbName;
    }

    // Method to open the database, if not already opened
    private open(): SQLite.WebSQLDatabase {
        if (this._database) {
            return this._database;
        }
        this._database = SQLite.openDatabase(this._dbName);
        return this._database;
    }

    // Method to execute a command, based on its type
    public async execute(commandBuilder: CommandBuilder): Promise<any> {
        try {
            if (commandBuilder instanceof DmlBuilder) {
                let commandBuilders: DmlBuilder[] = [commandBuilder];
                await this.executeTransactionalCommand(commandBuilders);
            } else if (commandBuilder instanceof DdlBuilder) {
                let commandBuilders: DdlBuilder[] = [commandBuilder];
                await this.executeTransactionalCommand(commandBuilders);
            } else if (commandBuilder instanceof DqlBuilder) {
                await this.executeNonTransactionalCommand(commandBuilder);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Method to execute non-transactional commands (DQL)
    public async executeNonTransactionalCommand<E extends Entity>(commandBuilder: DqlBuilder<E>): Promise<E[]> {
        const db = this.open();
        return new Promise((resolve, reject) => {
            db.readTransaction(
                (tx) => {
                    let sqlStatement = commandBuilder.build();
                    console.info(sqlStatement);
                    tx.executeSql(
                        sqlStatement
                        , []
                        , (_, resultSet) => {
                            let eConstructor: ClassConstructor<E> = commandBuilder.entityInstance.constructor as ClassConstructor<E>;
                            console.info('Result set: ', resultSet);
                            let activities = this.resultSetToObjects(resultSet, eConstructor);
                            resolve(activities);
                        }
                        , (_, error) => {
                            console.info('Command error ', error);
                            reject(error);
                            return true;
                        }
                    );
                }
                , (error) => reject(error)
            );
        });
    }

    // Method to execute transactional commands (DML or DDL)
    public async executeTransactionalCommand(commandBuilders: DmlBuilder[] | DdlBuilder[]): Promise<any> {
        const db = this.open();
        return new Promise((resolve, reject) => {
            db.transaction(
                (tx) => {
                    commandBuilders.forEach(commandBuilder => {
                            let sqlStatement = commandBuilder.build();
                            console.info(sqlStatement);
                            tx.executeSql(
                                sqlStatement
                                , []
                                , (_, resultSet) => {
                                    console.info(resultSet);
                                    resolve(resultSet);
                                }, (_, error) => {
                                    reject(error);
                                    console.error(error);
                                    return false;
                                }
                            )
                        }
                    );
                }
                , (error) => reject(error));
        });
    }

    // Method to execute a custom SQL query and transform the result set to entity objects
    executeCustomQuery<E extends Entity>(customQuery: string, entityInstance: E): Promise<E[]> {
        const db = this.open();
        return new Promise((resolve, reject) => {
            db.readTransaction(
                (tx) => {
                    console.info(customQuery);
                    tx.executeSql(
                        customQuery
                        , []
                        , (_, resultSet) => {
                            let eConstructor: ClassConstructor<E> = entityInstance.constructor as ClassConstructor<E>;
                            console.info('Result set: ', resultSet);
                            let activities = this.resultSetToObjects(resultSet, eConstructor);
                            resolve(activities);
                        }
                        , (_, error) => {
                            console.info('Command error ', error);
                            reject(error);
                            return true;
                        }
                    );
                }
                , (error) => reject(error)
            );
        });
    }


    // Method to transform a SQLResultSet to an array of objects by using object transformer and a instance of the target object
    private resultSetToObjects<T>(resultSet: SQLResultSet, objectType: new () => T): T[] {
        const rows = resultSet.rows;
        console.info('Fetched rows to convert: ', rows);
        const objects: T[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            const object: T = plainToInstance(objectType, row);
            objects.push(object);
        }

        return objects;
    }
}
