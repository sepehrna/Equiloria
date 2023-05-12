import React, {useLayoutEffect, useState} from "react";
import {RouteProp, useFocusEffect, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {ScreenDesk} from "../components/ScreenDesk";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import GroupedList, {GroupedListItem} from "../components/GroupedList";
import {
    calculate,
    findActivityParticipants, getActivityData,
    getAllBillsOfActivity
} from "../../controller/ActionServiceController";
import {LoaderResponse} from "../../common/types/LoaderResponse";
import {Alert, Pressable, StyleSheet, View} from "react-native";
import ActionButton from "../components/ActionButton";
import {Text} from "react-native-elements";
import {Activity} from "../../model/entities/Activity";
import {ValidatorResponse} from "../../services/IValidator";
import {OnScreenTransaction} from "./TransactionListScreen";
import {isValidatorResponse} from "../../utils/CheckUtils";

type ActivityDetailsRouteProp = RouteProp<RootStackParamList, 'ActivityDetails'>;
type ActivityDetailScreenProps = {
    route: ActivityDetailsRouteProp;
};
const ActivityDetails: React.FC<ActivityDetailScreenProps> = ({route}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ActivityDetails'>>();
    const activityId: string = route.params.activityId;
    const [activityName, setActivityName] = useState<string>('');
    const activityBillListId: string = 'activityBillList';
    const participantListId: string = 'participantList';
    const [bills, setBills] = useState<GroupedListItem[]>([]);
    const [participants, setParticipants] = useState<GroupedListItem[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => null, // this disables the back button
        });
    }, [navigation]);
    useFocusEffect(
        React.useCallback(() => {
            const loadActivity = async (): Promise<void> => {
                if (activityId) {
                    let foundActivity: Activity | null = await getActivityData(activityId);
                    if (foundActivity != null) {
                        setActivityName(foundActivity.activityName);
                    }
                }
            }
            const loadAllBillsOfActivity = async (): Promise<void> => {
                if (activityId) {
                    let result: GroupedListItem[] = [];
                    const bills: LoaderResponse[] = await getAllBillsOfActivity(activityId);
                    bills.forEach(bill => result.push({id: bill.id, value: bill.value}));
                    setBills(result);
                }
            };
            const loadActivityParticipants = async (): Promise<void> => {
                if (activityId) {
                    let result: GroupedListItem[] = [];
                    const participants: LoaderResponse[] = await findActivityParticipants(activityId);
                    participants.forEach(participant => result.push({id: participant.id, value: participant.value}));
                    setParticipants(result);
                }
            };
            loadActivity();
            loadAllBillsOfActivity();
            loadActivityParticipants();
        }, [])
    );

    function navigateToBillDetail(billId: string) {
        navigation.navigate('BillDetails', {billId: billId})
    }

    function navigateToParticipant() {
        navigation.navigate('Participants', {
            activityId: activityId,
            participantExclusionList: participants.map(value => value.id)
        })
    }

    function navigateToBillSelector() {
        navigation.navigate('BillSelector', {activityId: activityId});
    }

    function saveAndNavigateToMain() {
        navigation.navigate('Main');
    }

    const navigateToAddParticipant = (participantId: string) => {
        navigation.navigate('AddParticipant', {activityId: activityId, participantId: participantId})
    };

    async function calculateAndNavigateToTransactionScreen() {
        let transactions: OnScreenTransaction[] | ValidatorResponse = await calculate(activityId);
        if (isValidatorResponse(transactions)) {
            if (!transactions.validationResult && transactions.validationExceptionMessage) {
                Alert.alert(
                    'Calculation process was unsuccessful',
                    transactions.validationExceptionMessage,
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false}
                );
            }
        } else {
            if(transactions.length > 0) {
                navigation.navigate('TransactionListScreen', {transactions: transactions});
            }
            else {
                Alert.alert(
                    'No transaction',
                    'There is no transaction to be done. It may occurred due to the number of people in this activity',
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false}
                );
            }
        }
    }

    function getNameContainer() {
        return (
            <View style={styles.nameContainer}>
                <Pressable>
                    <Text style={styles.nameLabel}>Activity Name</Text>
                    <Text style={styles.nameValue}>{activityName}</Text>
                </Pressable>
            </View>
        );
    }

    function getBillList() {
        return <GroupedList listId={activityBillListId}
                            listTitle={'Bills'}
                            indicatorColor='#3374FF'
                            itemNavigator={navigateToBillDetail}
                            extenderButtonName={'Select bill'}
                            extenderButtonFunction={navigateToBillSelector}
                            itemList={bills}/>;
    }

    function getParticipantList() {
        return <GroupedList listId={participantListId}
                            listTitle={'Participants'}
                            extenderButtonName={'Add participant'}
                            indicatorColor='green'
                            itemNavigator={navigateToAddParticipant}
                            itemList={participants}
                            extenderButtonFunctionWithPassableObject={navigateToParticipant}
                            extenderPassableObject={activityId}/>;
    }

    function getButtons() {
        return (
            <View style={styles.buttonContainer}>
                <ActionButton text='Calculate'
                              onPress={calculateAndNavigateToTransactionScreen}
                              backgroundColor={'red'}/>
                <ActionButton text='Save and do it later'
                              onPress={saveAndNavigateToMain}
                              backgroundColor='black'
                              pressedBackgroundColor='gray'/>
            </View>
        );
    }

    return (
        <ScreenDesk items={
            [{componentId: '1', componentGenerator: getNameContainer}
                , {componentId: '2', componentGenerator: getBillList}
                , {componentId: '3', componentGenerator: getParticipantList}
                , {componentId: '4', componentGenerator: getButtons}]
        }/>
    );
}

const styles = StyleSheet.create({
    scanBillButton: {
        backgroundColor: 'blue',
    },
    enterManuallyButton: {
        backgroundColor: 'black',
    },
    nameContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 24,
        alignItems: 'center'
    },
    nameLabel: {
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'white',
        fontSize: 14,
        fontFamily: 'Avenir',
    },
    nameValue: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});

export {ActivityDetails};