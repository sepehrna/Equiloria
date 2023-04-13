import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from 'react-native-elements';
import WrappedAvatar from "../components/WrappedAvatar";
import GroupedList, {GroupedListItem} from "../components/GroupedList";
import {useDispatch} from "react-redux";
import {create} from "../redux/GroupedListSlicer";
import {AppDispatch} from "../redux/store";

const Main: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

    let activityList = 'activityList';
    let billList = 'billList';
    dispatch(create(billList));
    dispatch(create(activityList));
    const billItemLoader: () => GroupedListItem[] = () => {
        return [{id: '1', value: 'McDonald'}
            , {id: '2', value: 'Museum'}];
    };
    const activityItemLoader: () => GroupedListItem[] = () => {
        return [{id: '1', value: 'London'}
            , {id: '2', value: 'LondonTour'}];
    }

    return (
        <View style={styles.container}>
            <WrappedAvatar text={'Sepehr Najjarpour'}
                           subText={'Account details'}/>
            <GroupedList listId={billList}
                         listTitle={'Bills'}
                         extenderButtonName={'Add bill'}
                         indicatorColor='#3374FF'
                         loaderFunction={billItemLoader}/>
            <GroupedList listId={activityList}
                         listTitle={'Activities'}
                         extenderButtonName={'Add activity'}
                         indicatorColor='#FF4833'
                         loaderFunction={activityItemLoader}/>
        </View>
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
