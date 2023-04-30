import React, {useEffect} from 'react';
import {colors, Icon, ListItem} from "react-native-elements";
import {Pressable, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {create, load} from "../redux/GroupedListSlicer";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";

interface GroupedListItem {
    id: string;
    value: string;

}

interface GroupedListProps {

    listId: string;
    listTitle: string;
    itemList: GroupedListItem[];
    itemNavigator?: (itemId: string) => void;
    indicatorColor?: string;
    extenderButtonName: string;
    extenderButtonFunction: () => void | undefined;

}

const GroupedList: React.FC<GroupedListProps> = (props: GroupedListProps) => {
    let listId = props.listId;
    // const items = useSelector((state: RootState) => state.groupList.lists[listId]);
    const dispatch = useDispatch<AppDispatch>();

    // useEffect(() => {
    //     dispatch(create(listId));
    // }, [])
    //
    // useEffect(() => {
    //     dispatch(load(items, ));
    // }, [props.itemList])
    const handleLoadItems = async () => {

    };

    function generateListItems() {
        return props.itemList.map((item: GroupedListItem, index) => {
            return (
                <Pressable key={index} onPress={() => props.itemNavigator ? props.itemNavigator(item.id) : undefined}>
                    <ListItem bottomDivider
                              containerStyle={index === 0
                                  ? styles.topElementContainerStyle : undefined}>
                        <Icon style={styles.extenderIcon} name='square' type='font-awesome'
                              color={props.indicatorColor}/>
                        <ListItem.Content>
                            <ListItem.Title>{item.value}</ListItem.Title>
                        </ListItem.Content>
                        <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
                    </ListItem>
                </Pressable>
            );
        });
    }

    function generateAddButton() {
        return (
            <Pressable onPress={props.extenderButtonFunction}>
                <ListItem key={'add'}
                          containerStyle={[styles.bottomElementContainerStyle, styles.buttonContainerStyle]}>
                    <Icon style={styles.extenderIcon} name='plus' type='font-awesome' color={props.indicatorColor}/>
                    <ListItem.Content>
                        <ListItem.Title>{props.extenderButtonName}</ListItem.Title>
                    </ListItem.Content>
                    <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
                </ListItem>
            </Pressable>
        );
    }

    return (
        <View style={styles.groupedLists}>
            {generateListItems()}
            {generateAddButton()}
        </View>
    );
};

const styles = StyleSheet.create({
    groupedLists: {
        marginTop: 10,
        marginBottom: 10
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    buttonContainerStyle: {
        // fontSize: 20,
        // fontWeight: 'bold',
        // marginBottom: 16,
    },
    topElementContainerStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    bottomElementContainerStyle: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    extenderIcon: {
        textAlign: "left"
        , alignItems: 'flex-start'
        , justifyContent: "flex-end"
    }
});

export {GroupedListItem};
export default GroupedList;