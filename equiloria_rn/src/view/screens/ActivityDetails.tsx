import React from "react";
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList} from "../routers/ApplicationNavigationContainer";

type ActivityDetailsRouteProp = RouteProp<RootStackParamList, 'ActivityDetails'>;
type ActivityDetailScreenProps = {
    route: ActivityDetailsRouteProp;
};
const ActivityDetails: React.FC<ActivityDetailScreenProps> = ({route}) => {
    return (
        <>
        </>
    );
}

export {ActivityDetails};