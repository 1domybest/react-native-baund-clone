import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
const CameraScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text>카메라</Text>
            </View>
        </SafeAreaView>
    )
}

export default CameraScreen

const useStyles = makeStyles((theme, props) => ({
}));