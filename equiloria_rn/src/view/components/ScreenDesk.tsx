import React, {ReactNode} from "react";
import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import {colors} from "react-native-elements";
type FlatListItemProps = {
    componentId: string;
    componentGenerator: () => ReactNode;
}

type FlatListProps = {
    items: FlatListItemProps[];
}

const CustomFlatListItem = React.memo((item: FlatListItemProps) => {
    return (
        <View
            style={styles.componentContainer}>{item.componentGenerator()}
        </View>
    );
});

const ScreenDesk: React.FC<FlatListProps> = (props: FlatListProps) => {

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={props.items}
                keyExtractor={(item) => item.componentId}
                renderItem={({item}) => <CustomFlatListItem componentId={item.componentId}
                                                            componentGenerator={item.componentGenerator}/>}
                automaticallyAdjustKeyboardInsets
                scrollEnabled={true}
            />
        </SafeAreaView>
    )
}

export {ScreenDesk};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    componentContainer: {
        margin: 15,
        paddingHorizontal: 4,
        paddingVertical: 4,
        paddingBottom: 30,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.divider
    },
});