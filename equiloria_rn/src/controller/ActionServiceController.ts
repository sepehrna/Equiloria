import {Bill, BillBuilder} from "../model/entities/Bill";
import IActionServices, {IActionServiceServiceDefinition} from "../services/IActionServices";
import ContainerProvider from "./ioc/ContainerProvider";
import {LoaderResponse} from "../common/types/LoaderResponse";
import ACTION_SERVICE_NAME = IActionServiceServiceDefinition.ACTION_SERVICE_NAME;
import {Location, LocationBuilder} from "../model/entities/Location";

async function registerNewBill(billName: string, billAmount: number, description: string | null, latitude: number | null, longitude: number | null) {
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
    await actionService.registerNewBill(bill);
}

async function updateBill(billId: string, billAmount: number, description: string | null) {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    let toUpdateBill: Bill = new BillBuilder()
        .billId(billId)
        .billAmount(billAmount)
        .description(description)
        .build();
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

async function fetchBill(billId: string): Promise<Bill | null> {
    let actionService: IActionServices = ContainerProvider.provide().resolve(ACTION_SERVICE_NAME);
    return await actionService.getBillData(billId);
}

export {registerNewBill, updateBill, fetchAllBills, fetchBill};