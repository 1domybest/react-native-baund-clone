import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
const ProfileScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text>HomeScreen</Text>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const useStyles = makeStyles((theme, props) => ({
}));