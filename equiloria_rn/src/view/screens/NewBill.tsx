import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {Text} from 'react-native-elements';
import ActionButton from "../components/ActionButton";

const NewBill: React.FC = () => {
    const [billName, setBillName] = React.useState('');

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter name</Text>
                <TextInput
                    style={styles.input}
                    value={billName}
                    onChangeText={setBillName}
                    placeholder="Enter bill name"
                />
            </View>
            <View style={styles.buttonContainer}>
                <ActionButton text='Scan bill'/>
                <ActionButton text='Enter manually'
                              buttonStyle={({pressed}) => [styles.button, styles.enterManuallyButton, pressed && styles.buttonPressed]}
                              textStyle={styles.buttonText}/>
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
        width: '80%',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 24,
    },
    inputLabel: {
        position: 'absolute',
        top: -8,
        left: 8,
        paddingHorizontal: 4,
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: 14,
    },
    input: {
        padding: 8,
        fontSize: 16,
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
