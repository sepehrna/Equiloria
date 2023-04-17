import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HandledPickerItem} from "../components/HandledPicker";

interface HandledPickerState {
    lists: Record<string, HandledPickerItem[]>;

}

const initialState: HandledPickerState = {
    lists: {} as Record<string, HandledPickerItem[]>,
};
const handledPickerSlice = createSlice({
    name: 'handledPicker',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<string>) => {
            state.lists[action.payload] = [];
        },
        load: (state, action: PayloadAction<{ listId: string; items: HandledPickerItem[] }>) => {
            state.lists[action.payload.listId] = action.payload.items;
        },
    },
});

export {HandledPickerState};
export const {create, load} = handledPickerSlice.actions;
export default handledPickerSlice.reducer;