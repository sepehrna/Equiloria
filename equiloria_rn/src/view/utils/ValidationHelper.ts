import {Alert} from "react-native";

type ValidationMessage = {
    alertMessage: string;

}

enum ValidationType {
    EMPTY
}

const preventingAlert = (field: string, validationType: ValidationType): void => {
    let title: string = validationType === ValidationType.EMPTY ? 'Required field(s)' : '';
    let message: string = generateEmptyValidationMessage(field).alertMessage;
    Alert.alert(
        title,
        message,
        [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    );
};

const generateEmptyValidationMessage = (fieldName: string): ValidationMessage => {
    return {
        alertMessage: 'The ' + fieldName + ' is required'
    }
}

export {ValidationMessage, ValidationType};

export {preventingAlert};