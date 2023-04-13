import {Pressable, StyleSheet} from "react-native";
import {Text} from "react-native-elements";
import React from "react";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {TextStyle, ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import {PressableStateCallbackType} from "react-native/Libraries/Components/Pressable/Pressable";


export interface ActionButtonStateCallbackType {
    readonly pressed: boolean;
}

interface ActionButtonProps {

    buttonStyle?:
        | StyleProp<ViewStyle>
        | ((state: ActionButtonStateCallbackType) => StyleProp<ViewStyle>)
        | undefined;

    text?: string;
    textStyle?: StyleProp<TextStyle>

}

const ActionButton: React.FC<ActionButtonProps> = (props: ActionButtonProps) => {

    type ActionButtonStyleFunction = (state: ActionButtonStateCallbackType) => StyleProp<ViewStyle>;
    type PressableStyleFunction = (state: PressableStateCallbackType) => StyleProp<ViewStyle>;

    function convertStyleFunction(originalFunction: ActionButtonStyleFunction): PressableStyleFunction {
        return function (state: PressableStateCallbackType): StyleProp<ViewStyle> {
            const actionButtonState: ActionButtonStateCallbackType = {
                pressed: state.pressed,
            };
            return originalFunction(actionButtonState);
        };
    }

    function identifyProperProps() {
        return props.buttonStyle && typeof props.buttonStyle === 'function'
            ? convertStyleFunction((props.buttonStyle as (state: ActionButtonStateCallbackType) => StyleProp<ViewStyle>)) : defaultStyles.button;
    }

    return (
        <Pressable
            style={identifyProperProps()}>
            <Text style={props.textStyle ? props.textStyle : defaultStyles.buttonText}>{props.text}</Text>
        </Pressable>);
}

const defaultStyles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: 'blue'
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