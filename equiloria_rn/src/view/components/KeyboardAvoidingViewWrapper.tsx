import React from 'react';
import {View, KeyboardAvoidingView, Platform, ViewProps} from 'react-native';

interface CustomKeyboardAvoidingViewProps extends ViewProps {
    onPress?: () => void;
}

const KeyboardHandler: React.FC<CustomKeyboardAvoidingViewProps> = ({children, style, onPress}) => {
    if (Platform.OS === 'web') {
        return (
            <View style={style} onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
                {children}
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={style}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            onStartShouldSetResponder={() => true}
            onResponderRelease={onPress}
        >
            {children}
        </KeyboardAvoidingView>
    );
};

export default KeyboardHandler;
