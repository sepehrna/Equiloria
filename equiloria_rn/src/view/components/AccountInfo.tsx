import {StyleSheet, View} from "react-native";
import {Avatar, colors, Text} from "react-native-elements";
import React from "react";
import hairlineWidth = StyleSheet.hairlineWidth;

const defaultPicturePath: number = require('../../../assets/user-image-with-black-background.png');

interface AvatarProps {
    text: string;
    subText?: string;
    size?: ('small' | 'medium' | 'large' | 'xlarge') | number;
    rounded?: boolean;
    logoPath?: string;
}

const AccountInfo: React.FC<AvatarProps> = (props: AvatarProps) => {

    return (
        <View style={styles.headerContainer}>
            <Avatar
                size={props.size ? props.size : 'large'}
                rounded={props.rounded ? props.rounded : true}
                source={props.logoPath ? {bundle: props.logoPath} : defaultPicturePath}
            />
            <View style={styles.textContainer}>
                <Text h3 style={styles.headerText}>{props.text}</Text>
                <Text style={styles.headerSubText}>{props.subText}</Text>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: hairlineWidth,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10,
    },
    headerText: {
        marginLeft: 10,
        fontSize: 20
    },
    headerSubText: {
        marginLeft: 10,
        color: colors.grey0,
    },
});

export default AccountInfo;