// Use this class for PersonBalance object creation and retrieval
import {ParticipantBalance} from "./ParticipantBalance";

export class ParticipantBalanceListContainer {
    private idCounter = 0;
    private participantBalanceList: ParticipantBalance[] = [];

    // Amount of money paid at first
    createNewParticipantBalance(primitiveCreditValue: number, participantName: string): void {
        this.idCounter = this.idCounter + 1;
        this.participantBalanceList.push(new ParticipantBalance(this.idCounter, participantName, primitiveCreditValue));
    }

    // Participant which you want to remove from list object
    removeParticipant(participantBalance: ParticipantBalance): void {
        this.participantBalanceList = this.participantBalanceList.filter(person => person.getId() !== participantBalance.getId());
    }

    getList(): ParticipantBalance[] {
        return this.participantBalanceList;
    }

    getListSize(): number {
        return this.participantBalanceList.length;
    }
}
