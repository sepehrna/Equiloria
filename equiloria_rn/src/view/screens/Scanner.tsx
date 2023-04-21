import React, {useState, useEffect, useRef, RefObject} from 'react';
import {StyleSheet, View, Image, TextInput} from 'react-native';
import {Camera} from 'expo-camera';
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import ActionButton from "../components/ActionButton";
import TextRecognition from 'react-native-text-recognition';
// import { recognize } from 'react-native-text-recognition';
import {CameraCapturedPicture} from "expo-camera/src/Camera.types";
import MlkitOcr from 'react-native-mlkit-ocr';
import {MlkitOcrResult} from "react-native-mlkit-ocr/src";

const Scanner: React.FC = () => {
    const cameraRef: RefObject<Camera> = useRef<Camera>(null);

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [totalAmount, setTotalAmount] = useState<string>('');
    const [photo, setPhoto] = useState<string | null>(null)

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

    const recognizeText = async (imageUri: string | null) => {
        const options = {
            whitelist: '0123456789.,',
        };
        if (imageUri != null) {
            console.info(imageUri);
            let recognizedTexts: string[] = [];
            let recognizedTextsResult: MlkitOcrResult | null = null;
            try {
                // recognizedTexts = await TextRecognition.recognize(imageUri, {
                //     visionIgnoreThreshold: 0.5,
                // });
                recognizedTextsResult = await MlkitOcr.detectFromUri(imageUri);
            } catch (e) {
                console.error(e);
            }
            console.info(recognizedTextsResult);
            // recognizedTexts.forEach(recognizedText => recognizedText.replace(/[^\d.-]/g, ''))
            // const amount = recognizedTexts.replace(/[^\d.-]/g, '');
            // setTotalAmount(amount);
        }
    };

    const captureImage = async () => {
        console.info(cameraRef);
        if (cameraRef != null && cameraRef.current != null) {
            try {
                const options = {quality: 1, base64: true, exif: false};
                const takenPicture: CameraCapturedPicture = await cameraRef.current.takePictureAsync(options);
                setPhoto(takenPicture.uri);
            } catch (e) {
                console.error(e);
                await captureImage();
            }
            await recognizeText(photo);
        }
    };

    if (hasPermission === null) {
        return <View/>;
    }
    if (!hasPermission) {
        return <View><TextInput>No access to camera</TextInput></View>;
    }

    function getImage() {
        return <Image
            style={styles.tinyLogo}
            source={
                {uri: photo != null ? photo : undefined}
            }
        />;
    }

    return (
        <View style={defaultStyles.container}>
            <Camera style={defaultStyles.camera} ref={cameraRef}>
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
        // margin: 20,
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
        marginTop: 20,
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

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
    logo: {
        width: 66,
        height: 58,
    },
});

export default Scanner;
