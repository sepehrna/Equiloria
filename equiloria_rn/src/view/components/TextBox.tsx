import React from 'react';
import {StyleSheet, Text, TextInput, View} from "react-native";

type TextBoxProps = {

    label?: string,
    value: string,
    placeholder?: string | undefined,
    onChange?: ((text: string) => void) | undefined,
    isRequired: boolean

}

const TextBox: React.FC<TextBoxProps> = (props: TextBoxProps) => {
    function getIsRequiredLabel() {
        if (props.isRequired) {
            if (!props.label) {
                return (
                    <Text style={styles.asterisk}>* Required</Text>
                )
            } else {
                return (
                    <View style={styles.label}>
                        <Text>{props.label}</Text>
                        <Text style={styles.asterisk}> *</Text>
                    </View>
                )
            }
        }
        return <></>;
    }

    return (
        <View style={styles.inputContainer}>
            {getIsRequiredLabel()}
            <TextInput
                style={styles.input}
                value={props.value}
                onChangeText={props.onChange}
                placeholder={props.placeholder}
            />
        </View>
    )
}

export {TextBox};

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 24,
    },
    label: {
        flexDirection: 'row',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 9,
        color: '#ccc'
    },
    input: {
        paddingHorizontal: 10,
        height: '50%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 1,
        margin: 10,
    },
    asterisk: {
        fontSize: 12,
        color: 'red',
        marginLeft: 2,
        marginBottom: 9
    }
});