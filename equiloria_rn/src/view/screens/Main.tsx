import 'reflect-metadata';
import React, {useState} from 'react';
import AccountInfo from "../components/AccountInfo";
import GroupedList, {GroupedListItem} from "../components/GroupedList";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {fetchAllActivities, fetchAllBills, findUnAssignedBills} from "../../controller/ActionServiceController";
import {ScreenDesk} from "../components/ScreenDesk";
import {Platform} from "react-native";
import Constants from 'expo-constants';

const Main: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
    const billListId: string = 'billList';
    const activityListId: string = 'activityList';
    const [bills, setBills] = useState<GroupedListItem[]>([]);
    const [activities, setActivities] = useState<GroupedListItem[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadBills = async (): Promise<void> => {
                let result: GroupedListItem[] = [];
                const bills = await findUnAssignedBills();
                bills.forEach(bill => result.push({id: bill.id, value: bill.value}));
                setBills(result);
            };
            const loadActivities = async (): Promise<void> => {
                let result: GroupedListItem[] = [];
                const activities = await fetchAllActivities();
                activities.forEach(activity => result.push({id: activity.id, value: activity.value}));
                setActivities(result);
            };
            loadBills();
            loadActivities();
        }, [])
    );

    function navigateToNewActivity() {
        navigation.navigate('NewActivity')
    }

    function navigateToBillDetail(billId: string) {
        navigation.navigate('BillDetails', {billId: billId})
    }

    const navigateToAddBill: () => void = () => {
        navigation.navigate('NewBill');
    }

    function getWrappedAvatar() {
        return <AccountInfo text={'Equiloria User ;)'}
                            subText={Platform.OS !== 'web' ? Constants.deviceName + ' user / Demo' : 'Web User / Demo'}/>;
    }

    function getBillList() {
        return <GroupedList listId={billListId}
                            listTitle={'Bills'}
                            indicatorColor='#3374FF'
                            itemNavigator={navigateToBillDetail}
                            extenderButtonName={'Add bill'}
                            extenderButtonFunction={navigateToAddBill}
                            itemList={bills}/>;
    }

    function navigateToActivityDetails(activityId: string) {
        navigation.navigate('ActivityDetails', {activityId: activityId});
    }

    function getActivityList() {
        return <GroupedList listId={activityListId}
                            listTitle={'Activities'}
                            extenderButtonName={'Add activity'}
                            indicatorColor='#FF4833'
                            itemNavigator={navigateToActivityDetails}
                            itemList={activities}
                            extenderButtonFunction={navigateToNewActivity}/>;
    }

    return (
        <ScreenDesk items={
            [{componentId: '1', componentGenerator: getWrappedAvatar}
                , {componentId: '2', componentGenerator: getBillList}
                , {componentId: '3', componentGenerator: getActivityList}]
        }/>
    );
}

export default Main;
