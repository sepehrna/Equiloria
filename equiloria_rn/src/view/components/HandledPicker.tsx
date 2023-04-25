import {Platform, StyleSheet, View, FlatList} from "react-native";
import {Picker} from "@react-native-picker/picker";
import React, {useEffect, useState} from "react";
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
    const [flatListDataLength, setFlatListDataLength] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();

    const handleLoadItems = () => {
        dispatch(load({listId: props.pickerId, items: props.loaderFunction()}));
    };

    const flatListData = () => new Array(flatListDataLength).fill(null).map((_, index) => ({
        value: index.toString(),
        label: `Item ${index + 1}`,
    }));

    useEffect(() => {
        handleLoadItems();
    })


    function identifyPicker() {
        if (Platform.OS !== 'ios') {
            return (
                <Picker
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
                <>
                    <DropDownPicker
                        // onLayout={handleLoadItems}
                        onOpen={() => setFlatListDataLength(props.loaderFunction().length)}
                        onClose={() => setFlatListDataLength(0)}
                        items={props.loaderFunction()}
                        open={isOpen}
                        setOpen={() => {
                            setOpen(!isOpen)
                        }}
                        value={activity}
                        setValue={(value) => setActivity(value)}
                        autoScroll
                        placeholder={props.zeroItem.label}/>
                    <FlatList
                        data={flatListData()}
                        renderItem={() =>
                            <View style={defaultStyles.flatItemStyle}></View>}
                        keyExtractor={(item) => item.value}
                        scrollEnabled={!isOpen}
                    />
                </>
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
    },
    flatItemStyle: {
        padding: 20,
        borderBottomColor: '#ccc'
    }
});

export {HandledPickerItem, HandledPickerProps}
export default HandledPicker;