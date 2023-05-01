import Main from "../screens/Main";
import NewBill from "../screens/NewBill";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import BillDetails from "../screens/BillDetails";
import Scanner from "../screens/Scanner";
import {NewActivity} from "../screens/NewActivity";
import {ActivityDetails} from "../screens/ActivityDetails";
import {Participants} from "../screens/Participants";
import {AddParticipant} from "../screens/AddParticipant";

type RootStackParamList = {
    Main: undefined;
    NewBill: undefined;
    Scanner: { billName: string }
    BillDetails: { billName?: string, billId?: string, totalAmount?: number };
    NewActivity: undefined;
    ActivityDetails: { activityName?: string, activityId?: string };
    Participants: undefined
    AddParticipant: undefined
};

const stackNavigator = createStackNavigator<RootStackParamList>();
const ApplicationNavigationContainer: React.FC = () => {
    return (
        <NavigationContainer>
            <stackNavigator.Navigator>
                <stackNavigator.Screen
                    name="Main"
                    component={Main}
                    options={{
                        headerTitle: 'Equiloria',
                    }}
                />
                <stackNavigator.Screen
                    name="NewBill"
                    component={NewBill}
                    options={{
                        headerTitle: 'New bill',
                    }}
                />
                <stackNavigator.Screen
                    name="Scanner"
                    component={Scanner}
                    options={{
                        headerTitle: 'Scan bill',
                    }}
                />
                <stackNavigator.Screen
                    name="BillDetails"
                    component={BillDetails}
                    options={{
                        headerTitle: 'Bill details',
                    }}
                />
                <stackNavigator.Screen
                    name="NewActivity"
                    component={NewActivity}
                    options={{
                        headerTitle: 'New activity',
                    }}
                />
                <stackNavigator.Screen
                    name="ActivityDetails"
                    component={ActivityDetails}
                    options={{
                        headerTitle: 'Activity details',
                    }}
                />
                <stackNavigator.Screen
                    name="Participants"
                    component={Participants}
                    options={{
                        headerTitle: 'Participants',
                    }}
                />
                <stackNavigator.Screen
                    name="AddParticipant"
                    component={AddParticipant}
                    options={{
                        headerTitle: 'Add participants',
                        presentation: 'card'
                    }}
                />
            </stackNavigator.Navigator>
        </NavigationContainer>
    )
}

export {RootStackParamList};
export default ApplicationNavigationContainer;