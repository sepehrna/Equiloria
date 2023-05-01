import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Button, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";

interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
}

const initialContacts: Contact[] = [
    {id: '1', name: 'John Doe', phoneNumber: '123-456-7890'},
    {id: '2', name: 'Jane Doe', phoneNumber: '098-765-4321'},
];

const AddParticipant: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AddParticipant'>>();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleAddContact = () => {
        if (!name || !phoneNumber) {
            Alert.alert('Name and Phone Number are required');
            return;
        }

        const newContact: Contact = {id: Date.now().toString(), name, phoneNumber};
        initialContacts.push(newContact);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                placeholder="Phone Number"
                keyboardType="phone-pad"
            />
            <Button title="Add Contact" onPress={handleAddContact}/>
        </SafeAreaView>
    );
}

export {AddParticipant};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});
