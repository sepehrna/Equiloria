import {configureStore} from "@reduxjs/toolkit";
import groupedListReducer from "./GroupedListSlicer"
import handledPickerSlice from "./HandledPickerSlice";

const store = configureStore({
    reducer: {
        groupList: groupedListReducer,
        handledPicker: handledPickerSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store};