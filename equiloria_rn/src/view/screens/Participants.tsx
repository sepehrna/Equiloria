import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, FlatList, TextInput, Pressable} from 'react-native';
import {RouteProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {Icon} from "react-native-elements";
import {
    findNonRelatedActivityParticipants
} from "../../controller/ActionServiceController";
import {LoaderResponse} from "../../common/types/LoaderResponse";

// Define a type for Participant
interface Participant {
    id: string;
    name: string;

}

type ParticipantRouteProps = RouteProp<RootStackParamList, 'Participants'>;
type ParticipantScreenProps = {
    route: ParticipantRouteProps;
};

createStackNavigator();

// The Participants Screen
const Participants: React.FC<ParticipantScreenProps> = ({route}) => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Participants'>>();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const activityId: string = route.params.activityId;
    const [searchText, setSearchText] = useState<string>('');

    // Filter participant based on search text
    const filteredParticipants = participants.filter(
        (participant) =>
            participant.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleChosenParticipant = async (participantId: string): Promise<void> => {
        navigation.navigate('AddParticipant', {activityId: activityId, participantId: participantId});
    }

    function navigateToAddParticipant() {
        navigation.navigate('AddParticipant', {activityId: activityId, participantId: null});
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    style={{marginRight: 20}}
                    name='plus' type='font-awesome'
                    color='green'
                    onPress={navigateToAddParticipant}
                />
            ),
        });
    }, [navigation]);

    function isExcluded(participantExclusionList: string[] | null, participant: LoaderResponse): boolean {
        if (participantExclusionList != null) {
            for (let i = 0; i < participantExclusionList.length; i++) {
                if (participant.id === participantExclusionList[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    useFocusEffect(
        React.useCallback(() => {
            const loadNonRelatedParticipants = async (): Promise<void> => {
                let result: Participant[] = [];
                const loadedParticipants: LoaderResponse[] = await findNonRelatedActivityParticipants(activityId);
                console.info(loadedParticipants);
                loadedParticipants.forEach(participant => {
                    if (!isExcluded(route.params.participantExclusionList, participant)) {
                        result.push({id: participant.id, name: participant.value})
                    }
                });
                setParticipants(result);
            };
            loadNonRelatedParticipants();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                onChangeText={setSearchText}
                value={searchText}
                placeholder="Search..."
            />
            <FlatList
                data={filteredParticipants}
                keyExtractor={(item) => item.id}
                renderItem={({item, index}) => (
                    <View style={styles.listItem}>
                        <Pressable key={index} style={{flexDirection: 'row'}} onPress={() => handleChosenParticipant(item.id)}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name[0]}</Text>
                            </View>
                            <View style={styles.billInfo}>
                                <Text style={styles.billName}>{item.name}</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export {Participants}

// Define the styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        paddingHorizontal: 10,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    billInfo: {
        flex: 1,
    },
    billName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
