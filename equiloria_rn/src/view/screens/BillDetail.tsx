import React, {ReactNode, useEffect, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {Text} from 'react-native-elements';
import ActionButton from "../components/ActionButton";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import HandledPicker, {HandledPickerItem} from "../components/HandledPicker";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {create} from "../redux/HandledPickerSlice";
import {getDeviceLocation, getLocationAccessPermission} from "../../controller/DeviceServicesController";
import {fetchBill, registerNewBill, updateBill} from "../../controller/ActionServiceController";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {preventingAlert, ValidationType} from "../utils/ValidationHelper";
import {initialLocationCoordinates, LocationCoordinates} from "../../common/types/LocationCoordinates";
import {Bill} from "../../model/entities/Bill";
import {CustomFlatList} from "../components/CustomFlatList";

type BillDetailsRouteProp = RouteProp<RootStackParamList, 'BillDetail'>;
type BillDetailScreenProps = {
    route: BillDetailsRouteProp;
};

type ScreenComponentFlatListItemProps = {
    componentId: string;
    componentGenerator: () => ReactNode;
}

const BillDetailForm: React.FC<BillDetailScreenProps> = ({route}) => {
    const isUpdate = route.params.billId != undefined && route.params.billId !== '';
    const [billName, setBillName] = useState<string>('')
    const [amount, setAmount] = useState<string>('0.00');
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [tipAmount, setTipAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [locationAccessStatus, setLocationAccessStatus] = useState<Boolean | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
    const init = async () => {
        if (isUpdate) {
            let bill: Bill | null = await fetchBill(route.params.billId);
            if (bill != null) {
                setBillName(bill?.billName);
                let numberBillAmount: number = +bill.billAmount;
                let billAmount: string = numberBillAmount.toFixed(2)
                setAmount(billAmount);
                if (bill.description != null) {
                    setDescription(bill.description);
                }
            }
        } else {
            const inputTotalAmount: number | undefined = route.params.totalAmount;
            if (inputTotalAmount != undefined) {
                setAmount(inputTotalAmount === 0 ? '0.00' : inputTotalAmount.toFixed(2));
            }
            if (route.params.billName != undefined) {
                setBillName(route.params.billName);
            }
        }
        dispatch(create('activityList'));
    }
    useEffect(() => {
        init();
    }, [])

    const getLocationPermission = async () => {
        if (locationAccessStatus == null) {
            let locationAccessPermission: Boolean = await getLocationAccessPermission();
            setLocationAccessStatus(locationAccessPermission)
        }
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

    const navigateToMain = () => {
        navigation.navigate('Main');
    }

    async function register(finalAmount: string) {
        let locationCoordinates: LocationCoordinates = initialLocationCoordinates;
        if (locationAccessStatus != null && locationAccessStatus) {
            locationCoordinates = await getDeviceLocation(true);
        }
        await registerNewBill(billName, +finalAmount, description, locationCoordinates.latitude, locationCoordinates.longitude);
        navigateToMain();
    }

    function calculateTipAmount(): string {
        let finalAmount: number = 0;
        if (tipPercentage === 10) {
            finalAmount = +amount + ((+amount * 10) / 100);
        }
        if (tipPercentage === 20) {
            finalAmount = +amount + ((+amount * 20) / 100);
        } else if (tipAmount !== '') {
            finalAmount = +amount + +tipAmount;
        }
        return finalAmount.toFixed(0);
    }

    async function submit(): Promise<void> {
        await getLocationPermission();
        if (amount != null && amount !== '' && amount !== '0.00') {
            let finalAmount: string = calculateTipAmount();
            if (isUpdate) {
                await updateBill(route.params.billId, +finalAmount, description);
            } else {
                await register(finalAmount);
            }
            navigateToMain();
        } else {
            preventingAlert('Amount', ValidationType.EMPTY)
        }
    }

    const mainFlatListData = new Array<ScreenComponentFlatListItemProps>();
    mainFlatListData.push({componentId: '1', componentGenerator: getAmountContainer});
    mainFlatListData.push({componentId: '2', componentGenerator: getActivityDropDownContainer});
    mainFlatListData.push({componentId: '3', componentGenerator: getTipAmountContainer});
    mainFlatListData.push({componentId: '4', componentGenerator: getDescriptionContainer});
    mainFlatListData.push({componentId: '5', componentGenerator: getButtonContainer});

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
                    placeholder="Enter tip amount"
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
                    placeholder="Enter your description"
                    multiline
                />
            </View>
        </>;
    }

    function getButtonContainer() {
        return (
            <>
                <ActionButton text='Done' onPress={submit}/>
            </>
        );
    }

    return (
        <CustomFlatList items={mainFlatListData}/>
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
