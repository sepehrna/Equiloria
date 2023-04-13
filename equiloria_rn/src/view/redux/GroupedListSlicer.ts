import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GroupedListItem} from "../components/GroupedList";

export interface GroupedListState {
    lists: Record<string, GroupedListItem[]>;

}

export const initialState: GroupedListState = {
    lists: {} as Record<string, GroupedListItem[]>,
};
const groupedListSlice = createSlice({
    name: 'groupedList',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<string>) => {
            state.lists[action.payload] = [];
        },
        load: (state, action: PayloadAction<{ listId: string; items: GroupedListItem[] }>) => {
            state.lists[action.payload.listId] = action.payload.items;
        },
    },
});

export const {create, load} = groupedListSlice.actions;
export default groupedListSlice.reducer;

//     // state.groupedListItem = action.payload;
//     // let groupedListItems = state.groupedListItem.slice();
//     // console.info('InitState', groupedListItems)
//     // let newItems = action.payload;
//     // console.info('action', newItems);
//     // newItems.forEach(value => {
//     //     groupedListItems.push(value);
//     // })
//     // console.info('State', groupedListItems);
//     // return {
//     //     groupedListItem: groupedListItems
//     // }
//     // // action.payload.forEach(value => state.groupedListItem.push(value))
// },
