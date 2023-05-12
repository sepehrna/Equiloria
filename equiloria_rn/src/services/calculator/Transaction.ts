// Use this class constructor for each money transfer from person to another person
import {ParticipantBalance} from "./ParticipantBalance";

export default class Transaction {
    private readonly id: number;
    private payer: ParticipantBalance;
    private taker: ParticipantBalance;
    private transactionAmount: number;

    // Id of transaction
    // Person who pays money
    // Person who takes money
    // Amount of money that should transfer
    constructor(id: number, payer: ParticipantBalance, taker: ParticipantBalance, value: number) {
        this.id = id;
        this.payer = payer;
        this.taker = taker;
        this.transactionAmount = value;
        payer.payMoney(value);
        taker.takeMoney(value);
    }

    private swapIfNeeded() {
        if (this.transactionAmount < 0) {
            let newPayer: ParticipantBalance = new ParticipantBalance(this.taker.id, this.taker.participantId, this.taker.getCurrentCreditValue());
            let newTaker: ParticipantBalance = new ParticipantBalance(this.payer.id, this.payer.participantId, this.payer.getCurrentCreditValue());
            this.payer = newPayer;
            this.taker = newTaker;
            this.transactionAmount = this.transactionAmount * -1;
        }
    }

    getId(): number {
        return this.id;
    }

    getPayer(): ParticipantBalance {
        return this.payer;
    }

    getTaker(): ParticipantBalance {
        return this.taker;
    }

    getTransactionAmount(): number {
        return this.transactionAmount;
    }
}
