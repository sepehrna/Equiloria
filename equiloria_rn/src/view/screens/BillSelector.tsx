import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, FlatList, TextInput, Pressable} from 'react-native';
import {RouteProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {
    connectBillToActivity,
    findUnAssignedBills
} from "../../controller/ActionServiceController";
import {LoaderResponse} from "../../common/types/LoaderResponse";

// Define a type for BillSelector
interface BillSelectorItem {
    id: string;
    name: string;

}

type BillSelectorRouteProps = RouteProp<RootStackParamList, 'BillSelector'>;
type BillSelectorScreenProps = {
    route: BillSelectorRouteProps;
};

createStackNavigator();

// The BillSelector Screen
const BillSelector: React.FC<BillSelectorScreenProps> = ({route}) => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'BillSelector'>>();
    const [unAssignedBills, setUnAssignedBills] = useState<BillSelectorItem[]>([]);
    const activityId: string = route.params.activityId;
    const [searchText, setSearchText] = useState<string>('');

    // Filter bills based on search text
    const filteredBills = unAssignedBills.filter(
        (bills) =>
            bills.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleChosenBill = async (billId: string): Promise<void> => {
        await connectBillToActivity(billId, activityId);
        setTimeout(() => {
            console.info("This is handled delay for persisting all the things in database");
            navigation.navigate('ActivityDetails', {activityId: activityId});
        }, 200);
    }

    useFocusEffect(
        React.useCallback(() => {
            const loadNonRelatedBills = async (): Promise<void> => {
                let result: BillSelectorItem[] = [];
                const loadedBills: LoaderResponse[] = await findUnAssignedBills();
                loadedBills.forEach(bill => result.push({id: bill.id, name: bill.value}));
                setUnAssignedBills(result);
            };
            loadNonRelatedBills();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                onChangeText={setSearchText}
                value={searchText}
                placeholder="Search..."
            />
            <FlatList
                data={filteredBills}
                keyExtractor={(item) => item.id}
                renderItem={({item, index}) => (
                    <View style={styles.listItem}>
                        <Pressable key={index} style={{flexDirection: 'row'}} onPress={() => handleChosenBill(item.id)}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name[0]}</Text>
                            </View>
                            <View style={styles.billInfo}>
                                <Text style={styles.billName}>{item.name}</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export {BillSelector}

// Define the styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        paddingHorizontal: 10,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    billInfo: {
        flex: 1,
        marginTop: 10
    },
    billName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
