import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
const CommuntiyScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text>HomeScreen</Text>
            </View>
        </SafeAreaView>
    )
}

export default CommuntiyScreen

const useStyles = makeStyles((theme, props) => ({
}));