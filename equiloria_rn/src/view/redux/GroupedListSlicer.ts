import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GroupedListItem} from "../components/GroupedList";

interface GroupedListState {
    lists: Record<string, GroupedListItem[]>;

}

const initialState: GroupedListState = {
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
export {GroupedListState}
export default groupedListSlice.reducer;
