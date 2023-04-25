import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {colors} from 'react-native-elements';
import WrappedAvatar from "../components/WrappedAvatar";
import GroupedList, {GroupedListItem} from "../components/GroupedList";
import {useDispatch} from "react-redux";
import {create} from "../redux/GroupedListSlicer";
import {AppDispatch} from "../redux/store";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {fetchAllBills} from "../../controller/ActionServiceController";


const Main: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
    const navigateToAddBill: () => void = () => {
        navigation.navigate('NewBill');
    }

    const dispatch = useDispatch<AppDispatch>();

    let activityList = 'activityList';
    let billList = 'billList';
    dispatch(create(billList));
    dispatch(create(activityList));
    const billItemLoader: () => GroupedListItem[] = () => {
        let result: GroupedListItem[] = [];
        // fetchAllBills()
        //     .then(bills => bills.forEach(bill => result.push({id: bill.id, value: bill.value})));
        return [{id: '1', value: 'London'}
            , {id: '2', value: 'LondonTour'}]
    };

    const activityItemLoader: () => GroupedListItem[] = () => {
        return [{id: '1', value: 'London'}
            , {id: '2', value: 'LondonTour'}];
    }

    return (
        <ScrollView style={styles.container}>
            <WrappedAvatar text={'Sepehr Najjarpour'}
                           subText={'Account details'}/>
            <GroupedList listId={billList}
                         listTitle={'Bills'}
                         indicatorColor='#3374FF'
                         extenderButtonName={'Add bill'}
                         extenderButtonFunction={navigateToAddBill}
                         items={billItemLoader()}/>
            <GroupedList listId={activityList}
                         listTitle={'Activities'}
                         extenderButtonName={'Add activity'}
                         indicatorColor='#FF4833'
                         items={activityItemLoader()}
                         extenderButtonFunction={navigateToAddBill}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.grey3
    },
    headerText: {
        marginTop: 8,
    },
    headerSubText: {
        color: colors.grey0,
    },
});

export default Main;
