import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FastShip from '../components/FastShip';
import StandardShip from '../components/StandardShip'

const Tab = createMaterialTopTabNavigator();

export default function NewList() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, color: '#112D4E' },
                tabBarStyle: { backgroundColor: '#F9F7F7' },
            }}
        >
            <Tab.Screen name="Fast" component={FastShip} options={{title: 'Giao hàng nhanh'}} />
            <Tab.Screen name="Standard" component={StandardShip} options={{title: 'Giao hàng tiêu chuẩn'}}/>
        </Tab.Navigator>
    )
}