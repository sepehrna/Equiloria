// App.tsx
import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { initializeDatabase } from './src/test/MockGeneratorFunctions';

const App: React.FC = () => {
    const handlePress = () => {
        insertData();
    };

    const insertData = async () => {
        try {
            await initializeDatabase()
            console.log('Mock data inserted successfully.');
        } catch (error) {
            console.error('Error inserting mock data:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.button}>
                <Text style={styles.buttonText}>Insert Mock Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

interface Styles {
    container: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
