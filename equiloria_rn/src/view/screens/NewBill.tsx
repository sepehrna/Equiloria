import React from 'react';
import {StyleSheet, View} from 'react-native';
import ActionButton from "../components/ActionButton";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {preventingAlert, ValidationType} from "../utils/ValidationHelper";
import {ScreenDesk} from "../components/ScreenDesk";
import {TextBox} from "../components/TextBox";

const NewBill: React.FC = () => {
    const [billName, setBillName] = React.useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewBill'>>();

    const navigateToScanner = () => {
        if (billName != '' || billName !== '') {
            navigation.navigate('Scanner', {billName: billName});
        } else {
            preventingAlert('Bill name', ValidationType.EMPTY);
        }
    }
    const navigateToBillDetail = () => {
        if (billName != '' || billName !== '') {
            navigation.navigate('BillDetails', {billName: billName, totalAmount: 0});
        } else {
            preventingAlert('Bill name', ValidationType.EMPTY);
        }
    }

    function getNameInputContainer() {
        return (
            <TextBox
                // label={'Bill name'}
                value={billName}
                onChange={setBillName}
                placeholder='Enter bill name'
                isRequired={true}
            />
        );
    }

    function getButtons() {
        return (
            <View style={styles.buttonContainer}>
                <ActionButton text='Scan bill' onPress={navigateToScanner}/>
                <ActionButton text='Enter manually'
                              onPress={navigateToBillDetail}
                              backgroundColor='black'
                              pressedBackgroundColor='gray'/>
            </View>
        );
    }

    return (
        <ScreenDesk
            items={[{componentId: '1', componentGenerator: getNameInputContainer}
                , {componentId: '2', componentGenerator: getButtons}]}/>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});
export default NewBill;
