import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, View} from "react-native";
import {Provider} from "react-redux";
import {store} from "./src/view/redux/store";
import ApplicationNavigationContainer from "./src/view/routers/ApplicationNavigationContainer";
import KeyboardAvoidingViewWrapper from "./src/view/components/KeyboardAvoidingViewWrapper";

createStackNavigator();
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
                <KeyboardAvoidingViewWrapper style={{flex: 1}}>
                    <View style={styles.applicationContainer} onLayout={onLayoutRootView}>
                        <ApplicationNavigationContainer/>
                    </View>
                </KeyboardAvoidingViewWrapper>
        </Provider>
    );
}
const styles = StyleSheet.create({
    applicationContainer: {
        flex: 1
    }
})