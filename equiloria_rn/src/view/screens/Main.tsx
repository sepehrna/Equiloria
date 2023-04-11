import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from 'react-native-elements';
import WrappedAvatar from "../components/WrappedAvatar";
import WrappedGroupedList from "../components/WrappedGroupedList";

const Main: React.FC = () => {
    return (
        <View style={styles.container}>
            <WrappedAvatar text={'Sepehr Najjarpour'}
            subText={'Account details'}/>
            <WrappedGroupedList listTitle={'Bills'}
                                extenderButtonName={'Add bill'}
                                indicatorColor='#3374FF'
                                items={[{title: 'McDonald', subtitle: 'McDonald'}
                                    , {title: 'Museum', subtitle: 'Museum'}]}/>
            <WrappedGroupedList listTitle={'Activities'}
                                extenderButtonName={'Add activity'}
                                indicatorColor='#FF4833'
                                items={[{title: 'London', subtitle: 'London'}]}/>
            {/*<a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik -*/}
            {/*    Flaticon</a>*/}
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
