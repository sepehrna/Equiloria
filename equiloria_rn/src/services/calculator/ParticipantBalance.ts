// Each person needs a class to store and retrieve their credit
// and debit information
export class ParticipantBalance {
    // Each person has a constant id that can't be changed
    readonly id: number;
    readonly participantId: string;
    // Each person has a credit value that is the amount of money they paid so far
    private currentCreditValue: number;

    constructor(id: number, participantId: string, primitiveCreditValue: number) {
        this.id = id;
        this.participantId = participantId;
        this.currentCreditValue = primitiveCreditValue;
    }

    getId(): number {
        return this.id;
    }

    getCurrentCreditValue(): number {
        return this.currentCreditValue;
    }

    getParticipantId(): string {
        return this.participantId;
    }

    // Amount of money that person paid and should increase their credit value
    payMoney(value: number): void {
        this.currentCreditValue = this.currentCreditValue + value;
    }

    // Amount of money that person paid and should decrease their credit value
    takeMoney(value: number): void {
        this.currentCreditValue = this.currentCreditValue - value;
    }
}
