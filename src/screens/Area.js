import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'

export default function Area ({navigation}) {
    return (
        <View>
            <Text>Area Screen</Text>
            <Button title = "Thêm khu vực"
                onPress={() => navigation.navigate('AddArea')} 
            />
        </View>
    )
}