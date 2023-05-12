import React, {useState} from 'react';
import {StyleSheet, Alert, View, TextInput} from 'react-native';
import {RouteProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {
    addParticipantToActivity, getParticipant
} from "../../controller/ActionServiceController";
import ActionButton from "../components/ActionButton";
import {ScreenDesk} from "../components/ScreenDesk";
import {Text} from "react-native-elements";
import {LoaderResponse} from "../../common/types/LoaderResponse";

type AddParticipantRouteProps = RouteProp<RootStackParamList, 'AddParticipant'>;
type AddParticipantScreenProps = {
    route: AddParticipantRouteProps;
};
const AddParticipant: React.FC<AddParticipantScreenProps> = ({route}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AddParticipant'>>();
    const activityId = route.params.activityId;
    const participantId = route.params.participantId;
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [spentAmount, setSpentAmount] = useState<string>('');

    useFocusEffect(
        React.useCallback(() => {
            const loadParticipant = async (): Promise<void> => {
                if (participantId) {
                    let foundParticipant: LoaderResponse | null = await getParticipant(participantId);
                    if (foundParticipant != null) {
                        setFirstName(foundParticipant.value.substring(0, foundParticipant.value.indexOf(' ')))
                        setLastName(foundParticipant.value.substring(foundParticipant.value.indexOf(' '), foundParticipant.value.length))
                    }
                }
            }
            loadParticipant();
        }, [])
    );

    const handleAddParticipant = async () => {
        if (!firstName || !lastName || !spentAmount) {
            Alert.alert('First name, Last name and spentAmount are required');
            return;
        }
        await addParticipantToActivity(activityId, participantId, firstName, lastName, spentAmount);
        setTimeout(() => {
            console.info("This is handled delay for persisting all the things in database");
            navigation.navigate('ActivityDetails', {activityId: activityId});
        }, 200);
    };

    const handleCancel = () => {
        navigation.navigate('ActivityDetails', {activityId: activityId});
    }

    function getInputs() {
        return (
            <>
                <View style={styles.label}>
                    <Text>First name</Text>
                    <Text style={styles.asterisk}> *</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter first name"
                        multiline
                    />
                </View>
                <View style={styles.label}>
                    <Text>Last name</Text>
                    <Text style={styles.asterisk}> *</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter last name"
                        multiline
                    />
                </View>
                <View style={styles.label}>
                    <Text>Spent amount</Text>
                    <Text style={styles.asterisk}> *</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={spentAmount}
                        onChangeText={setSpentAmount}
                        placeholder="Enter spent amount"
                        multiline
                    />
                </View>
            </>
        );
    }

    function getButtons() {
        return (
            <View style={styles.buttonContainer}>
                <ActionButton text='Add participant'
                              onPress={handleAddParticipant}
                              backgroundColor={'green'}/>
                <ActionButton text='Cancel'
                              onPress={handleCancel}
                              backgroundColor={'black'}/>
            </View>
        );
    }

    return (
        <ScreenDesk
            items={[{componentId: '1', componentGenerator: getInputs}
                , {componentId: '2', componentGenerator: getButtons}]}/>
    );
}

export {AddParticipant};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    asterisk: {
        fontSize: 12,
        color: 'red',
        marginLeft: 2,
        marginBottom: 9
    },
    label: {
        flexDirection: 'row',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#ccc'
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
});
