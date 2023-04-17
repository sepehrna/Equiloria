import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {Camera} from 'expo-camera';
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import ActionButton from "../components/ActionButton";
// import TesseractOcr from 'react-native-tesseract-ocr';

const Scanner: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [totalAmount, setTotalAmount] = useState<string>('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Scanner'>>();

    const navigateToDetail = () => {
        console.info(totalAmount);
        navigation.navigate('BillDetail', {totalAmount: +totalAmount});
    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const recognizeText = async (image: string | undefined) => {
        const options = {
            whitelist: '0123456789.,',
        };
        const recognizedText = /*await TesseractOcr.recognize(image, 'eng', options)*/'15';
        const amount = recognizedText.replace(/[^\d.-]/g, '');
        setTotalAmount(amount);
    };

    const captureImage = async () => {
        if (cameraRef) {
            const options = {quality: 0.5, base64: true};
            const data = await cameraRef.takePictureAsync(options);
            await recognizeText(data.base64);
        }
    };

    if (hasPermission === null) {
        return <View/>;
    }
    if (!hasPermission) {
        return <View><TextInput>No access to camera</TextInput></View>;
    }

    return (
        <View style={defaultStyles.container}>
            <Camera style={defaultStyles.camera} ref={(ref) => setCameraRef(ref)}>
                <View style={defaultStyles.overlay}/>
            </Camera>
            <TextInput
                style={defaultStyles.amountInput}
                value={totalAmount}
                keyboardType="numeric"
                placeholder="Total Amount"
                onChangeText={setTotalAmount}
            />
            <View style={defaultStyles.buttonContainer}>
                <ActionButton text={'Take'} onPress={captureImage}/>
                <ActionButton text={'Enter manually'} backgroundColor={'black'} onPress={navigateToDetail}/>
            </View>
        </View>
    );
};

const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        margin: 20,
    },
    overlay: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'dashed',
        borderRadius: 10,
        margin: 50,
    },
    amountInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 30,
    },
});

export default Scanner;
