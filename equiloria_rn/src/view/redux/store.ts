import {configureStore} from "@reduxjs/toolkit";
import groupedListReducer from "./GroupedListSlicer"

const store = configureStore({
    reducer: {
        groupList: groupedListReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store};