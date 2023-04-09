// App.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {insertMockData} from './src/test/MockGeneratorFunctions';

const App = () => {
    const handlePress = async () => {
        try {
            await insertMockData();
            console.log('Mock data inserted successfully.');
        } catch (error) {
            console.error('Error inserting mock data:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Insert Mock Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
});

export default App;
