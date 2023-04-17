import Main from "../screens/Main";
import NewBill from "../screens/NewBill";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import BillDetail from "../screens/BillDetail";
import Scanner from "../screens/Scanner";

type RootStackParamList = {
    Main: undefined;
    NewBill: undefined;
    Scanner: undefined
    BillDetail: { totalAmount: number };
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
                    name="BillDetail"
                    component={BillDetail}
                    options={{
                        headerTitle: 'Bill detail',
                    }}
                />
            </stackNavigator.Navigator>
        </NavigationContainer>
    )
}

export {RootStackParamList};
export default ApplicationNavigationContainer;