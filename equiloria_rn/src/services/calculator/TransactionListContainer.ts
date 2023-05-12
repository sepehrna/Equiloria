// Use this class for Transaction object creation and retrieve
import {ParticipantBalance} from "./ParticipantBalance";
import Transaction from "./Transaction";

export class TransactionListContainer {
    private idCounter = 0;
    private transactionList: Transaction[] = [];

    // Person who pays money
    // Person who takes money
    // Amount of money that should transfer
    createNewTransaction(payer: ParticipantBalance, taker: ParticipantBalance, value: number): void {
        this.idCounter += 1;
        this.transactionList.push(new Transaction(this.idCounter, payer, taker, value));
    }

    getList(): Transaction[] {
        return this.transactionList;
    }
}
