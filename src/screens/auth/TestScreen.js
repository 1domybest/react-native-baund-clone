import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TestScreen = () => {
  return (
    <View style={styles.container}>
        <View>
            <Text>TestScreen</Text>
        </View>
    </View>
    
  )
}

export default TestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
})