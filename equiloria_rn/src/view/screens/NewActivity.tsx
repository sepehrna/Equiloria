import React from "react";
import {ScreenDesk} from "../components/ScreenDesk";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {preventingAlert, ValidationType} from "../utils/ValidationHelper";
import {TextBox} from "../components/TextBox";
import {StyleSheet, View} from "react-native";
import ActionButton from "../components/ActionButton";
import {registerNewActivity} from "../../controller/ActionServiceController";

const NewActivity: React.FC = () => {
    const [activityName, setActivityName] = React.useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewActivity'>>();

    function navigateToMain() {
        navigation.navigate('Main');
    }

    async function navigateToActivityDetail() {
        if (activityName != '' || activityName !== '') {
            let registeredActivityId = await registerNewActivity(activityName, null);
            navigation.navigate('ActivityDetails', {activityId: registeredActivityId});
        } else {
            preventingAlert('Activity name', ValidationType.EMPTY);
        }
    }

    async function save() {
        if (activityName != '' || activityName !== '') {
            await registerNewActivity(activityName, null);
            navigateToMain();
        } else {
            preventingAlert('Activity name', ValidationType.EMPTY);
        }
    }

    function getNameInputContainer() {
        return (
            <TextBox
                value={activityName}
                onChange={setActivityName}
                placeholder='Enter activity name'
                isRequired={true}
            />
        );
    }

    function getButtons() {
        return (
            <View style={styles.buttonContainer}>
                <ActionButton text='Proceed'
                              onPress={navigateToActivityDetail}
                              backgroundColor={'red'}/>
                <ActionButton text='Save and do it later'
                              onPress={save}
                              backgroundColor='black'
                              pressedBackgroundColor='gray'/>
            </View>
        );
    }

    return (
        <ScreenDesk items={[{componentId: '1', componentGenerator: getNameInputContainer}
            , {componentId: '2', componentGenerator: getButtons}]}/>
    );

}
export {NewActivity};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 100
    }
});