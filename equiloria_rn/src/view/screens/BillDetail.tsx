import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    Pressable,
    TextInput
} from 'react-native';
import {Text} from 'react-native-elements';
import ActionButton from "../components/ActionButton";
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import HandledPicker, {HandledPickerItem} from "../components/HandledPicker";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {create} from "../redux/HandledPickerSlice";

type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetail'>;
type BillDetailFormProps = {
    route: BillDetailsRouteProp;
};

const BillDetailForm: React.FC<BillDetailFormProps> = ({route}) => {
    const [amount] = useState<number>(route.params.totalAmount);
    const [tipPercentage, setTipPercentage] = useState(0);
    const [tipAmount, setTipAmount] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    dispatch(create('activityList'));
    const handleTipPercentage = (percentage: number) => {
        setTipPercentage(percentage);
        setTipAmount('');
    };

    const activityItemLoader: () => HandledPickerItem[] = () => {
        return [{value: '1', label: 'London'}
            , {value: '2', label: 'LondonTour'}];
    }

    return (
        <View style={styles.container}>
            <View style={styles.amountContainer}>
                <TextInput style={styles.amountLabel}>Bill amount</TextInput>
                <Text style={styles.amountValue}>£{amount.toFixed(2)}</Text>
            </View>
            <View style={styles.componentContainer}>
                <Text style={styles.label}>Activity</Text>
                <HandledPicker pickerId={'activity'}
                               zeroItem={{value: '', label: 'Choose activity'}}
                               loaderFunction={activityItemLoader}/>
            </View>
            <View style={styles.componentContainer}>
                <Text style={styles.label}>Add tip amount</Text>
                <View style={styles.tipContainer}>
                    <Pressable
                        style={({pressed}) => [
                            styles.tipButton,
                            tipPercentage === 10 ? styles.tipButtonSelected : {},
                            pressed && styles.tipButtonPressed,
                        ]}
                        onPress={() => handleTipPercentage(10)}
                    >
                        <Text style={styles.tipButtonText}>10%</Text>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            styles.tipButton,
                            tipPercentage === 20 ? styles.tipButtonSelected : {},
                            pressed && styles.tipButtonPressed,
                        ]}
                        onPress={() => handleTipPercentage(20)}
                    >
                        <Text style={styles.tipButtonText}>20%</Text>
                    </Pressable>
                    <TextInput
                        style={styles.tipInput}
                        value={tipAmount}
                        onChangeText={text => {
                            setTipAmount(text);
                            setTipPercentage(0);
                        }}
                        placeholder="Enter manually"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    multiline
                />
            </View>
            <View style={styles.componentContainer}>
                <ActionButton text='Done'/>
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
    amountContainer: {
        flexDirection: 'column',
        width: '80%',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginBottom: 24,
        alignItems: 'center'
    },
    amountLabel: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Avenir',
    },
    amountValue: {
        color: 'white',
        fontSize: 24,
    },
    componentContainer: {
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 24,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginBottom: 24,
    },
    tipButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderColor: 'blue',
        borderWidth: 1,
    },
    tipButtonSelected: {
        backgroundColor: 'blue',
    },
    tipButtonPressed: {
        backgroundColor: '#5F9EA0',
    },
    tipButtonText: {
        color: 'blue',
    },
    tipInput: {
        width: '30%',
        padding: 8,
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 4,
    },
    inputContainer: {
        width: '80%',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
    },
    input: {
        padding: 8,
        fontSize: 16,
    },
    button: {
        width: '80%',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    doneButton: {
        marginBottom: 16,
    },
    buttonPressed: {
        backgroundColor: '#5F9EA0',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'column',
        width: '80%',
        justifyContent: 'space-between',
    }
});
export default BillDetailForm;
