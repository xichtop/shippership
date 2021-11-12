import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'

export default function AddArea ({navigation}) {
    return (
        <View>
            <Text>AddArea Screen</Text>
            <Button title = "Quay lại"
                onPress={() => navigation.goBack()} 
            />
        </View>
    )
}