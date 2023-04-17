import {Pressable, StyleSheet} from "react-native";
import {Text} from "react-native-elements";
import React from "react";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {TextStyle, ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";


export interface ActionButtonStateCallbackType {
    readonly pressed: boolean;
}

interface ActionButtonProps {

    buttonStyle?:
        | StyleProp<ViewStyle>

    onPress?: () => {} | void | undefined;
    backgroundColor?: string;
    pressedBackgroundColor?: string;
    disabled?: boolean;
    disabledBackgroundColor?: boolean;
    text?: string;
    textStyle?: StyleProp<TextStyle>

}

const ActionButton: React.FC<ActionButtonProps> = (props: ActionButtonProps) => {

    function getPropsColor(pressed: boolean) {
        let resultColor: string | undefined = props.backgroundColor;
        if (pressed) {
            if (props.pressedBackgroundColor) {
                resultColor = props.pressedBackgroundColor;
            }
        }
        return {backgroundColor: resultColor};
    }

    function defaultColor(pressed: boolean) {
        if (props.disabled == null || !props.disabled) {
            return {backgroundColor: pressed ? 'rgba(0, 122, 255, 0.5)' : 'rgb(0, 122, 255)'};
        }
        return {backgroundColor: 'gray'};
    }

    return (
        <Pressable
            style={({pressed}) => [
                props.buttonStyle ? props.buttonStyle : defaultStyles.button,
                props.backgroundColor ? getPropsColor(pressed) : defaultColor(pressed),
            ]}
            onPress={() => {
                if (props.onPress) {
                    props.onPress();
                }
                console.log('Button pressed');
            }}>
            <Text style={props.textStyle ? props.textStyle : defaultStyles.buttonText}>{props.text}</Text>
        </Pressable>);
}

const defaultStyles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'blue',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonPressed: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
})
export default ActionButton;