import React from 'react';
import {colors, Icon, ListItem, Text} from "react-native-elements";
import {StyleSheet, View} from "react-native";

export type Item = {
    title: string, subtitle: string, indicatorIcon?: typeof Icon /*| 'square' | 'circle'*/;
};

interface WrappedGroupedListProps {
    listTitle: string;
    extenderButtonName: string;
    indicatorColor?: string;
    items: Item[];

}

const WrappedGroupedList: React.FC<WrappedGroupedListProps> = (props: WrappedGroupedListProps) => {
    return (
        <View style={styles.groupedLists}>
            {props.items.map((item, index) => {
                let indicatorIcon = <Icon style={styles.extenderIcon} name='square' type='font-awesome'
                                          color={props.indicatorColor}/>;
                return (
                    <ListItem key={index}
                              bottomDivider
                              containerStyle={index === 0
                                  ? styles.topElementContainerStyle : undefined}>
                        {indicatorIcon}
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
                    </ListItem>
                );
            })}
            <ListItem key={'add'}
                      hitSlop={1000}
                      containerStyle={[styles.bottomElementContainerStyle, styles.buttonContainerStyle]}>
                <Icon style={styles.extenderIcon} name='plus' type='font-awesome' color={props.indicatorColor}/>
                <ListItem.Content>
                    <ListItem.Title>{props.extenderButtonName}</ListItem.Title>
                </ListItem.Content>
                <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
            </ListItem>
        </View>
    );
};

const styles = StyleSheet.create({
    groupedLists: {
        marginTop: 16
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    buttonContainerStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
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
export default WrappedGroupedList;