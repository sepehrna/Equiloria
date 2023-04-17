import {Platform, StyleSheet, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {load} from "../redux/HandledPickerSlice";
import DropDownPicker from 'react-native-dropdown-picker'

interface HandledPickerItem {
    label: string;
    value: string;
}

interface HandledPickerProps {

    pickerId: string;
    zeroItem: HandledPickerItem;
    loaderFunction: () => HandledPickerItem[];

}

const HandledPicker: React.FC<HandledPickerProps> = (props: HandledPickerProps) => {
    const [activity, setActivity] = useState('');
    const [isOpen, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleLoadItems = () => {
        dispatch(load({listId: props.pickerId, items: props.loaderFunction()}));
    };

    function identifyPicker() {
        if (Platform.OS !== 'ios') {
            return (
                <Picker
                    onLayout={handleLoadItems}
                    selectedValue={activity}
                    onValueChange={value => setActivity(value as string)}
                    style={defaultStyles.picker}>
                    <Picker.Item label={props.zeroItem.label} value={props.zeroItem.value}/>
                    {props.loaderFunction().map((value) => (
                        <Picker.Item label={value.label} value={value.value}/>
                    ))}
                </Picker>
            );
        } else {
            return (
                <DropDownPicker
                    onLayout={handleLoadItems}
                    items={props.loaderFunction()}
                    open={isOpen}
                    setOpen={() => {
                        setOpen(!isOpen)
                    }}
                    value={activity}
                    setValue={(value) => setActivity(value)}
                    autoScroll
                    placeholder={props.zeroItem.label}/>
            );
        }
    }

    return (
        <View style={defaultStyles.pickerContainer}>
            {identifyPicker()}
        </View>
    );
}

const defaultStyles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 4,
        marginBottom: 24,
    },
    picker: {
        width: '100%',
    }
});

export {HandledPickerItem, HandledPickerProps}
export default HandledPicker;