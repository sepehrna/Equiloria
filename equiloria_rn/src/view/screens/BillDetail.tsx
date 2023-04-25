import React, {ReactNode, useState} from 'react';
import {
    StyleSheet,
    View,
    Pressable,
    TextInput, FlatList
} from 'react-native';
import {Text} from 'react-native-elements';
import ActionButton from "../components/ActionButton";
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import HandledPicker, {HandledPickerItem} from "../components/HandledPicker";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {create} from "../redux/HandledPickerSlice";
import {getDeviceLocation, getLocationAccessPermission} from "../../controller/DeviceServicesController";
import {SafeAreaView} from "react-native-safe-area-context";
import {registerNewBill} from "../../controller/ActionServiceController";

type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetail'>;
type BillDetailScreenProps = {
    route: BillDetailsRouteProp;
};

type ScreenComponentFlatListItemProps = {
    componentId: string;
    componentGenerator: () => ReactNode;
}

const BillDetailForm: React.FC<BillDetailScreenProps> = ({route}) => {
    const billName: string = route.params.billName;
    const inputTotalAmount: number = route.params.totalAmount;
    let amountInitialState: string = inputTotalAmount === 0 ? '0.00' : inputTotalAmount.toFixed(2);
    const [amount, setAmount] = useState<string>(amountInitialState);
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [tipAmount, setTipAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [locationAccessStatus, setLocationAccessStatus] = useState<Boolean | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    dispatch(create('activityList'));
    const getLocationPermission = async () => {
        if (locationAccessStatus == null) {
            let locationAccessPermission: Boolean = await getLocationAccessPermission();
            setLocationAccessStatus(locationAccessPermission)
        }
    };
    const getLocation = async (isGranted: boolean) => {
        await getDeviceLocation(isGranted);
    }
    const handleTipPercentage = (percentage: number) => {
        setTipPercentage(percentage);
        setTipAmount('');
    };
    const activityItemLoader: () => HandledPickerItem[] = () => {
        return [{value: '1', label: 'London'}
            , {value: '2', label: 'LondonTour'}];
    }

    function handleAmountString(): void {
        if (amount !== '' && !amount.includes('.')) {
            setAmount(() => amount.concat('.00'));
        }
    }

    async function submit(): Promise<void> {
        // await registerNewBill(billName, +amount, description);
    }

    const mainFlatListData = new Array<ScreenComponentFlatListItemProps>();
    mainFlatListData.push({componentId: '1', componentGenerator: getAmountContainer})
    mainFlatListData.push({componentId: '2', componentGenerator: getActivityDropDownContainer})
    mainFlatListData.push({componentId: '3', componentGenerator: getTipAmountContainer})
    mainFlatListData.push({componentId: '4', componentGenerator: getDescriptionContainer})
    mainFlatListData.push({componentId: '5', componentGenerator: getButtonContainer})

    function getAmountContainer() {
        return (
            <View style={styles.amountContainer}>
                <Pressable>
                    <Text style={styles.amountLabel}>{billName}</Text>
                    <View style={styles.editableAmountLabel}>
                        <Text style={styles.amountValue}>£</Text>
                        <TextInput style={styles.amountValue}
                                   keyboardType='numeric'
                                   onChangeText={setAmount}
                                   value={amount}
                                   onEndEditing={handleAmountString}/>
                    </View>
                </Pressable>
            </View>
        );
    }

    function getActivityDropDownContainer() {
        return <>
            <Text style={styles.label}>Activity</Text>
            <HandledPicker pickerId={'activity'}
                           zeroItem={{value: '', label: 'Choose activity'}}
                           loaderFunction={activityItemLoader}/>
        </>;
    }

    function getTipAmountContainer() {
        return <>
            <Text style={styles.label}>Add tip amount</Text>
            <View style={styles.tipContainer}>
                <Pressable
                    style={({pressed}) => [
                        styles.tipButton,
                        tipPercentage === 10 ? styles.tipButtonSelected : {},
                        pressed && styles.tipButtonPressed,
                    ]}
                    onPress={() => handleTipPercentage(10)}>
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
                    placeholder="Enter tip"
                    keyboardType="numeric"
                />
            </View>
        </>;
    }

    function getDescriptionContainer() {
        return <>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    multiline
                />
            </View>
        </>;
    }

    function getButtonContainer() {
        return <>
            <ActionButton text='Done' onPress={submit}/>
        </>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={mainFlatListData}
                renderItem={(item) => <View style={styles.componentContainer}>{item.item.componentGenerator()}</View>}
                keyExtractor={item => item.componentId}
                scrollEnabled={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    amountContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 24,
        alignItems: 'center'
    },
    amountLabel: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Avenir',
    },
    amountValue: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    componentContainer: {
        margin: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#ccc'
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    tipButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
    },
    tipButtonSelected: {
        backgroundColor: 'blue',
    },
    tipButtonPressed: {
        backgroundColor: '#5F9EA0',
    },
    tipInput: {
        width: '50%',
        padding: 8,
        borderWidth: 1,
        borderRadius: 10,
    },
    tipButtonText: {
        fontWeight: 'bold'
    },
    inputContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1
    },
    input: {
        padding: 8,
        fontSize: 16,
    },

    editableAmountLabel: {
        flexDirection: 'row'
    },
});
export default BillDetailForm;
