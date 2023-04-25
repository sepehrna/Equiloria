import {Bill, BillBuilder} from "../model/entities/Bill";
import IActionService from "../services/IActionService";
import ContainerProvider from "./ioc/ContainerProvider";
import {actionServicesInterfaceName} from "../services/IActionService";
import {LoaderResponse} from "../common/types/LoaderResponse";

const actionService: IActionService = ContainerProvider.provide().resolve(actionServicesInterfaceName);

async function registerNewBill(billName: string, billAmount: number, description: string | null) {
    let bill: Bill = new BillBuilder()
        .billName(billName)
        .billAmount(billAmount)
        .description(description)
        .build();
    await actionService.registerNewBill(bill);
}

async function fetchAllBills(): Promise<LoaderResponse[]> {
    let result: LoaderResponse[] = [];
    let bills: Bill[] = await actionService.fetchAllBills();
    bills.forEach(bill => {
        result.push({id: bill.billId, value: bill.billName})
    });
    return result;
}

export {registerNewBill, fetchAllBills};