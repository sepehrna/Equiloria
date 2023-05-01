import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, FlatList, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {Icon} from "react-native-elements";

// Define a type for Participant
interface Participant {
    id: string;
    name: string;
    phoneNumber: string;
}

// Define your contacts data
const contacts: Participant[] = [
    {id: '1', name: 'John Doe', phoneNumber: '123-456-7890'},
    {id: '2', name: 'Jane Doe', phoneNumber: '098-765-4321'},
    // Add more contacts as needed
];
createStackNavigator();

// The Participants Screen
function Participants() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Participants'>>();
    const [searchText, setSearchText] = useState('');

    // Filter contacts based on search text
    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
            contact.phoneNumber.includes(searchText)
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    style={{marginRight: 20}}
                    name='plus' type='font-awesome'
                    color='green'
                    onPress={() => navigation.navigate('AddParticipant')}
                />
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                onChangeText={setSearchText}
                value={searchText}
                placeholder="Search..."
            />
            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.listItem}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.name[0]}</Text>
                        </View>
                        <View style={styles.participantInfo}>
                            <Text style={styles.participantName}>{item.name}</Text>
                            <Text style={styles.participantNumber}>{item.phoneNumber}</Text>
                        </View>
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
    participantInfo: {
        flex: 1,
    },
    participantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    participantNumber: {
        color: 'gray',
    },
});
