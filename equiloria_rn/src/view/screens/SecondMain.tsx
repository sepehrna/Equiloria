import {FlatList, Pressable, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {ReactNode, useState} from "react";
import WrappedAvatar from "../components/WrappedAvatar";
import {colors, Icon, ListItem} from "react-native-elements";
import {GroupedListItem} from "../components/GroupedList";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {LoaderResponse} from "../../common/types/LoaderResponse";
import {fetchAllBills} from "../../controller/ActionServiceController";

type MainScreenComponentFlatListItemProps = {
    componentId: string;
    componentGenerator: () => ReactNode;
}
export const SecondMain: React.FC = () => {

    // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SecondMain'>>();
    const [bills, setBills] = useState<LoaderResponse[]>([]);

    /*const billItemLoader: () => LoaderResponse[] = () => {
        let result: LoaderResponse[] = [];
        fetchAllBills()
            .then(bills => bills.forEach(bill => result.push({id: bill.id, value: bill.value})));
        console.info('Bills load result: ', result);
        return result;
    };*/

    function getAvatar() {
        return (
            <WrappedAvatar text={'Sepehr Najjarpour'}
                           subText={'Account details'}/>
        )
    }

    function generateBills() {
        return bills.map((bill: LoaderResponse, index) => {
            return (
                <Pressable key={index}>
                    <ListItem bottomDivider
                              containerStyle={index === 0
                                  ? styles.topElementContainerStyle : undefined}>
                        <Icon style={styles.extenderIcon} name='square' type='font-awesome'
                              color={'#3374FF'}/>
                        <ListItem.Content>
                            <ListItem.Title>{bill.value}</ListItem.Title>
                        </ListItem.Content>
                        <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
                    </ListItem>
                </Pressable>
            );
        });
    }

    function extenderButton() {
        return (
            <Pressable>
                <ListItem key={'add'}
                          containerStyle={[styles.bottomElementContainerStyle, styles.buttonContainerStyle]}>
                    <Icon style={styles.extenderIcon} name='plus' type='font-awesome'
                          color={'#3374FF'}/>
                    <ListItem.Content>
                        <ListItem.Title>Add bill</ListItem.Title>
                    </ListItem.Content>
                    <Icon name='chevron-right' type='font-awesome' color={colors.grey3}/>
                </ListItem>
            </Pressable>
        )
    }

    function billList() {
        return (
            <View style={styles.groupedLists}>
                {generateBills()}
                {extenderButton()}
            </View>
        )
    }

    const mainFlatListData = new Array<MainScreenComponentFlatListItemProps>();
    mainFlatListData.push({componentId: '1', componentGenerator: getAvatar});
    // mainFlatListData.push({componentId: '2', componentGenerator: billList});
    // mainFlatListData.push({componentId: '3', componentGenerator: getActivityList});
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                onLayout={() => {
                    // setBills(billItemLoader());
                }}
                data={mainFlatListData}
                renderItem={(item) => <View
                    style={styles.componentContainer}>{item.item.componentGenerator()}</View>}
                keyExtractor={item => item.componentId}
                scrollEnabled={true}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    componentContainer: {
        margin: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    topElementContainerStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    extenderIcon: {
        textAlign: "left"
        , alignItems: 'flex-start'
        , justifyContent: "flex-end"
    },
    groupedLists: {
        marginTop: 16
    },
    bottomElementContainerStyle: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    buttonContainerStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    }

});