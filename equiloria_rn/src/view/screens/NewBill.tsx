import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import ActionButton from "../components/ActionButton";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";

const NewBill: React.FC = () => {
    const [billName, setBillName] = React.useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewBill'>>();

    const navigateToScanner = () => {
        navigation.navigate('Scanner');
    }
    const navigateToBillDetail = () => {
        navigation.navigate('BillDetail', {totalAmount: 0});
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={billName}
                    onChangeText={setBillName}
                    placeholder="Enter bill name"
                />
            </View>
            <View style={styles.buttonContainer}>
                <ActionButton text='Scan bill' onPress={navigateToScanner}/>
                <ActionButton text='Enter manually'
                              onPress={navigateToBillDetail}
                              backgroundColor='black'
                              pressedBackgroundColor='gray'/>
            </View>
        </View>
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
        width: '80%',
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
        width: '80%',
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
    }
});
export default NewBill;
