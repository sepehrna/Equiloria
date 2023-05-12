// Use this class to calculate list of transactions needed to settle debts of group of persons to each other
import {TransactionListContainer} from "./TransactionListContainer";
import {ParticipantBalanceListContainer} from "./ParticipantBalanceListContainer";

export class PayFlowCalculator {
    private static balancedCredit: number;

    // This method sums all payments and divides it by their quantity to calculate balanced credit
    private static calculateBalancedCredit(participantList: ParticipantBalanceListContainer): void {
        let sum = 0;
        for (let participantBalance of participantList.getList()) {
            sum += +participantBalance.getCurrentCreditValue();
        }
        this.balancedCredit = sum / participantList.getListSize();
    }

    // This method is recursive and finds persons with maximum debt and maximum credit and calculates a transaction
    // which makes one or two of them reach balanced credit and removes them from list then repeats until list is empty
    private static minPayMax(personList: ParticipantBalanceListContainer, transactionList: TransactionListContainer): void {
        if (personList.getListSize() > 1) {
            let minCreditPerson = personList.getList().reduce((prev, curr) => prev.getCurrentCreditValue() < curr.getCurrentCreditValue() ? prev : curr);
            let maxCreditPerson = personList.getList().reduce((prev, curr) => prev.getCurrentCreditValue() > curr.getCurrentCreditValue() ? prev : curr);
            if (maxCreditPerson.getCurrentCreditValue() - this.balancedCredit > this.balancedCredit - minCreditPerson.getCurrentCreditValue()) {
                transactionList.createNewTransaction(minCreditPerson, maxCreditPerson, this.balancedCredit - minCreditPerson.getCurrentCreditValue());
                personList.removeParticipant(minCreditPerson);
            } else if (maxCreditPerson.getCurrentCreditValue() - this.balancedCredit < this.balancedCredit - minCreditPerson.getCurrentCreditValue()) {
                transactionList.createNewTransaction(minCreditPerson, maxCreditPerson, maxCreditPerson.getCurrentCreditValue() - this.balancedCredit);
                personList.removeParticipant(maxCreditPerson);
            } else if (maxCreditPerson.getCurrentCreditValue() - this.balancedCredit === this.balancedCredit - minCreditPerson.getCurrentCreditValue()) {
                transactionList.createNewTransaction(minCreditPerson, maxCreditPerson, maxCreditPerson.getCurrentCreditValue() - this.balancedCredit);
                personList.removeParticipant(maxCreditPerson);
                personList.removeParticipant(minCreditPerson);
            }
            this.minPayMax(personList, transactionList);
        }
    }

    // List of participants who have debt to each other
    // Transaction list to add calculated transactions
    static execute(personList: ParticipantBalanceListContainer, transactionList: TransactionListContainer): void {
        this.calculateBalancedCredit(personList);
        this.minPayMax(personList, transactionList);
    }
}
