// Define the action type and payload shape
import {GroupedListItem} from "../components/GroupedList";
import {PayloadAction} from "@reduxjs/toolkit";
import {GroupedListState, groupedListInitialState} from "./GroupedListSlicer";

export interface UpdateListAction {
    type: 'UPDATE_LIST';
    payload: GroupedListItem[];
}

// Define the initial state shape

// Define the reducer with the specific action types
const groupedListReducer = (state: GroupedListState = groupedListInitialState, action: PayloadAction<UpdateListAction>): GroupedListState => {
    switch (action.payload.type) {
        case 'UPDATE_LIST':
            console.info(action.payload.payload)
            // Create a new state object with the updated list property
            return {
                ...state,
                // groupedListItem: action.payload.payload,
            };
        default:
            return state;
    }
};

export default groupedListReducer;
