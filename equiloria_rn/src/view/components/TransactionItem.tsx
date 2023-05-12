import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, colors, ListItem} from 'react-native-elements';
import {OnScreenTransaction} from "../screens/TransactionListScreen";
import hairlineWidth = StyleSheet.hairlineWidth;

interface TransactionItemProps {
    transaction: OnScreenTransaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({transaction}) => {
    const payerInitial = transaction.payer[0];
    const takerInitial = transaction.taker[0];

    return (
        <ListItem containerStyle={styles.container}>
            <ListItem.Content>
                <Avatar
                    rounded
                    size={"large"}
                    title={payerInitial}
                    overlayContainerStyle={{backgroundColor: 'red'}}
                />
                <ListItem.Title style={{fontSize: 13, marginTop: 10}}>{transaction.payer}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content>
                <Avatar
                    rounded
                    size={"large"}
                    titleStyle={{color: 'black', fontStyle: 'italic', fontSize: 16}}
                    containerStyle={{borderStyle: 'dashed', borderWidth: 1, borderColor: '#ED5D5A'}}
                    title={'£' + transaction.transactionAmount}
                    // overlayContainerStyle={{backgroundColor: '#FECCD1'}}
                />
            </ListItem.Content>
            <ListItem.Content>
                <Avatar
                    rounded
                    size={"large"}
                    title={takerInitial}
                    overlayContainerStyle={{backgroundColor: 'green'}}
                />
                <ListItem.Title style={{fontSize: 13, marginTop: 10}}>{transaction.taker}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: colors.grey5,
        marginVertical: 5,
        borderBottomWidth: hairlineWidth
    },
});

export default TransactionItem;
