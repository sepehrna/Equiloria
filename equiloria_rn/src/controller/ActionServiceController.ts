import {Bill, BillBuilder} from "../model/entities/Bill";
import IActionServices, {IActionServiceServiceDefinition} from "../services/IActionServices";
import ContainerProvider from "./ioc/ContainerProvider";
import {LoaderResponse} from "../common/types/LoaderResponse";
import {Location, LocationBuilder} from "../model/entities/Location";
import {Activity, ActivityBuilder} from "../model/entities/Activity";
import {Participant, ParticipantBuilder} from "../model/entities/Participant";
import {ValidatorResponse} from "../services/IValidator";
import {ActivityParticipant, ActivityParticipantBuilder} from "../model/entities/ActivityParticipants";
import {OnScreenTransaction} from "../view/screens/TransactionListScreen";
import {isValidatorResponse} from "../utils/CheckUtils";
import Transaction from "../services/calculator/Transaction";
import ACTION_SERVICE_NAME = IActionServiceServiceDefinition.ACTION_SERVICE_NAME;


async function fetchAllActivities(): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse[] = [];
    let activities: Activity[] = await actionService.fetchAllActivities();
    activities.forEach(activity => {
        result.push({id: activity.activityId, value: activity.activityName})
    });
    return result;
}

async function registerNewActivity(activityName: string, description: string | null): Promise<string> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let activity: Activity = new ActivityBuilder()
        .activityName(activityName)
        .build();
    let registeredActivityId: string | ValidatorResponse = await actionService.registerNewActivity(activity);
    if (typeof registeredActivityId == 'string') {
        return registeredActivityId;
    }
    return '';
}

async function connectBillToActivity(billId: string, activityId: string): Promise<void | null> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let bill: Bill | null = await actionService.getBillData(billId);
    if (bill != null) {
        await updateBill(bill.billId, bill.billAmount, bill.description, activityId);
    }
}

async function getActivityData(activityId: string): Promise<Activity | null> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    return await actionService.getActivityData(activityId);
}

async function registerNewBill(billName: string, billAmount: number, activityId: string | null, description: string | null, latitude: number | null, longitude: number | null): Promise<void> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let location: Location | null = null;
    if (latitude != null && longitude != null) {
        location = new LocationBuilder()
            .latitude(latitude)
            .longitude(longitude)
            .build();
    }
    let bill: Bill = new BillBuilder()
        .billName(billName)
        .billAmount(billAmount)
        .description(description)
        .location(location)
        .build();
    if (activityId != null && activityId !== '') {
        let foundActivity: Activity | null = await actionService.getActivityData(activityId);
        if (foundActivity) {
            foundActivity?.bills.push(bill);
            await actionService.updateActivity(foundActivity);
            return;
        }
    }
    await actionService.registerNewBill(bill);
}

async function updateBill(billId: string, billAmount: number, description: string | null, activityId: string | null) {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let toUpdateBill: Bill = new BillBuilder()
        .billId(billId)
        .billAmount(billAmount)
        .description(description)
        .build();
    await actionService.updateBill(toUpdateBill);
    if (activityId != null && activityId !== '') {
        let foundActivity: Activity | null = await actionService.getActivityData(activityId);
        if (foundActivity) {
            foundActivity?.bills.push(toUpdateBill);
            await actionService.updateActivity(foundActivity);
            return;
        }
    }
    if (toUpdateBill != null) {
        toUpdateBill.billAmount = billAmount ? billAmount : toUpdateBill?.billAmount;
        toUpdateBill.description = description != null ? description : toUpdateBill.description;
        await actionService.updateBill(toUpdateBill);
    }
}

async function fetchAllBills(): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse[] = [];
    let bills: Bill[] = await actionService.fetchAllBills();
    bills.forEach(bill => {
        result.push({id: bill.billId, value: bill.billName})
    });
    return result;
}

async function findUnAssignedBills(): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse[] = [];
    let bills: Bill[] = await actionService.findUnAssignedBills();
    bills.forEach(bill => {
        result.push({id: bill.billId, value: bill.billName})
    });
    return result;
}

async function getAllBillsOfActivity(activityId: string): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse[] = [];
    let bills: Bill[] = await actionService.getAllBillsOfActivity(activityId);
    bills.forEach(bill => {
        result.push({id: bill.billId, value: bill.billName})
    });
    return result;
}

async function fetchBill(billId: string): Promise<Bill | null> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    return await actionService.getBillData(billId);
}

async function connectParticipantToActivity(participantId: string, activityId: string, spentAmount: number): Promise<void> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let activityParticipant: ActivityParticipant = new ActivityParticipantBuilder()
        .participantId(participantId)
        .spentAmount(spentAmount)
        .activityId(activityId)
        .build();
    await actionService.connectParticipantToActivity(activityParticipant);
}

async function addParticipantToActivity(activityId: string, participantId: string | null, firstName: string, lastName: string, spentAmount: string): Promise<void> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let toOperateParticipantId: string | ValidatorResponse = '';
    if (participantId != null) {
        let participant: Participant | null = await actionService.getParticipant(participantId);
        if (participant != null) {
            toOperateParticipantId = participant.participantId;
        }
    } else {
        let toRegisterParticipant: Participant = new ParticipantBuilder().participantName(firstName + ' ' + lastName).build();
        toOperateParticipantId = await actionService.registerNewParticipant(toRegisterParticipant);
    }
    if (typeof toOperateParticipantId == "string") {
        await connectParticipantToActivity(toOperateParticipantId, activityId, +spentAmount);
    }
}

async function findNonRelatedActivityParticipants(activityId: string): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let participants: Participant[] = await actionService.findNonRelatedActivityParticipants(activityId);

    //To remove duplicate participant
    let uniqueParticipants = participants.filter((participant, index, self) =>
        index === self.findIndex((p) => p.participantId === participant.participantId && p.participantName === participant.participantName)
    );
    return uniqueParticipants.map(participant => ({
        id: participant.participantId,
        value: participant.participantName
    }));
}

async function findActivityParticipants(activityId: string): Promise<LoaderResponse[]> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse[] = [];
    let participants: Participant[] = await actionService.findActivityParticipants(activityId);
    participants.forEach(participant => {
        result.push({id: participant.participantId, value: participant.participantName})
    });
    return result;
}

async function getParticipant(participantId: string): Promise<LoaderResponse | null> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let result: LoaderResponse | null = null;
    let participant: Participant | null = await actionService.getParticipant(participantId);
    if (participant != null) {
        result = {id: participant.participantId, value: participant.participantName};
    }
    return result;
}

async function calculate(activityId: string): Promise<OnScreenTransaction[] | ValidatorResponse> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let transactions: Transaction[] | ValidatorResponse = await actionService.calculateTransactions(activityId);
    if (isValidatorResponse(transactions)) {
        return transactions;
    } else {
        let result: OnScreenTransaction[] = [];
        for (let i = 0; i < transactions.length; i++) {
            let payer: Participant | null = await actionService.getParticipant(transactions[i].getPayer().getParticipantId());
            let taker: Participant | null = await actionService.getParticipant(transactions[i].getTaker().getParticipantId());
            if (payer != null && taker != null) {
                result.push({
                    transactionId: transactions[i].getId(),
                    transactionAmount: transactions[i].getTransactionAmount().toFixed(2),
                    payer: payer.participantName,
                    taker: taker.participantName
                })
            }
        }
        return result;
    }
}

export {
    registerNewActivity
    , fetchAllActivities
    , registerNewBill
    , updateBill
    , fetchAllBills
    , fetchBill
    , getAllBillsOfActivity
    , addParticipantToActivity
    , findActivityParticipants
    , connectParticipantToActivity
    , findNonRelatedActivityParticipants
    , getActivityData
    , connectBillToActivity
    , findUnAssignedBills
    , getParticipant
    , calculate
};