import React from 'react';
import TransactionItem from '../components/TransactionItem';
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";
import {FlatListItemProps, ScreenDesk} from "../components/ScreenDesk";
import ActionButton from "../components/ActionButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";


export type OnScreenTransaction = {
    transactionId: number,
    transactionAmount: string,
    payer: string,
    taker: string,
}

type TransactionListScreenRouteProps = RouteProp<RootStackParamList, 'TransactionListScreen'>;

interface TransactionListScreenProps {
    route: TransactionListScreenRouteProps;
}

const TransactionListScreen: React.FC<TransactionListScreenProps> = ({route}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'TransactionListScreen'>>();

    function handleNavigateToMain() {
        navigation.navigate('Main');
    }

    // Map transactions to FlatListItemProps array
    const items: FlatListItemProps[] = route.params.transactions.map(transaction => ({
        componentId: transaction.transactionId.toString(),
        componentGenerator: () => <TransactionItem transaction={transaction}/>,
    }));


    items.push({
        componentId: new Date().getTime().toString(), componentGenerator: () => {
            return (
                <ActionButton
                    text='Done'
                    onPress={handleNavigateToMain}/>
            );
        }
    })

    return <ScreenDesk items={items}/>;
};

export default TransactionListScreen;
