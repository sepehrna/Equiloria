import SqliteInMemoryCommandExecutor from "../model/sql-components/command-executors/SqliteInMemoryCommandExecutor";
import {ActivityBuilder} from "../model/entities/Activity";
import {BillBuilder} from "../model/entities/Bill";
import {ActivityRepository} from "../model/repositories/ActivityRepository";
import {BillRepository} from "../model/repositories/BillRepository";


const executor = new SqliteInMemoryCommandExecutor();
const billRepo = new BillRepository(executor);
const activityRepo = new ActivityRepository(executor, billRepo);

// Create activities table
await activityRepo.createTable();

// Create bills table
await billRepo.createTable();
await billRepo.addAllRelations();

// Generate mock data
const activity1 = new ActivityBuilder()
    .activityName("Activity 1")
    .activityDate(new Date(2023, 0, 1))
    .bill(new BillBuilder().billName("Bill 1-1").billDate(new Date(2023, 0, 1)))
    .bill(new BillBuilder().billName("Bill 1-2").billDate(new Date(2023, 0, 2)))
    .build();

const activity2 = new ActivityBuilder()
    .activityName("Activity 2")
    .activityDate(new Date(2023, 1, 1))
    .bill(new BillBuilder().billName("Bill 2-1").billDate(new Date(2023, 1, 1)))
    .build();

const activity3 = new ActivityBuilder()
    .activityName("Activity 3")
    .activityDate(new Date(2023, 2, 1))
    .bill(new BillBuilder().billName("Bill 3-1").billDate(new Date(2023, 2, 1)))
    .bill(new BillBuilder().billName("Bill 3-2").billDate(new Date(2023, 2, 2)))
    .bill(new BillBuilder().billName("Bill 3-3").billDate(new Date(2023, 2, 3)))
    .build();

// insertMockData.ts
export async function insertMockData() {
    // Insert mock data
    await activityRepo.insert(activity1);
    await activityRepo.insert(activity2);
    await activityRepo.insert(activity3);
}
