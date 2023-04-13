import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, View} from "react-native";
import BillDetail from "./src/view/screens/BillDetail";
import Main from "./src/view/screens/Main";
import {Provider} from "react-redux";
import {store} from "./src/view/redux/store";

const stackNavigator = createStackNavigator();
SplashScreen.preventAutoHideAsync().catch((reason) => {
    console.warn(reason);
});
export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    async function prepare(): Promise<void> {
        try {
            // await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.warn(e);
        } finally {
            setAppIsReady(true);
        }
    }

    useEffect(() => {
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <Provider store={store}>
            <View style={styles.applicationContainer} onLayout={onLayoutRootView}>
                <NavigationContainer>
                    <stackNavigator.Navigator>
                        <stackNavigator.Screen
                            name="Equiloria"
                            component={Main}
                            options={{
                                headerTitle: 'Equiloria',
                            }}
                            // name="NewBill"
                            // component={NewBill}
                            // options={{
                            //     headerTitle: 'New bill',
                            // }}
                            // name="BillDetail"
                            // component={BillDetail}
                            // options={{
                            //     headerTitle: 'Bill detail',
                            // }}
                        />
                    </stackNavigator.Navigator>
                </NavigationContainer>
            </View>
        </Provider>
    );
}
const styles = StyleSheet.create({
    applicationContainer: {
        flex: 1
    }
})