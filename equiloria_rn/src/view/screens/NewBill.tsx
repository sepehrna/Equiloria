import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import ActionButton from "../components/ActionButton";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {preventingAlert, ValidationType} from "../utils/ValidationHelper";
import {CustomFlatList} from "../components/CustomFlatList";

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
            navigation.navigate('BillDetail', {billName: billName, totalAmount: 0});
        } else {
            preventingAlert('Bill name', ValidationType.EMPTY);
        }
    }

    function getNameInputContainer() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.asterisk}>* Required</Text>
                <TextInput
                    style={styles.input}
                    value={billName}
                    onChangeText={setBillName}
                    placeholder="Enter bill name"
                />
            </View>
        );
    }

    function getButtons() {
        return <View style={styles.buttonContainer}>
            <ActionButton text='Scan bill' onPress={navigateToScanner}/>
            <ActionButton text='Enter manually'
                          onPress={navigateToBillDetail}
                          backgroundColor='black'
                          pressedBackgroundColor='gray'/>
        </View>;
    }

    return (
        <CustomFlatList
            items={[{componentId: '1', componentGenerator: getNameInputContainer}
                , {componentId: '2', componentGenerator: getButtons}]}/>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    scanBillButton: {
        backgroundColor: 'blue',
    },
    enterManuallyButton: {
        backgroundColor: 'black',
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: 'blue'
    },
    buttonPressed: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    asterisk: {
        fontSize: 12,
        color: 'red',
        marginLeft: 2,
        marginBottom: 5
    }
});
export default NewBill;
