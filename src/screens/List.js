import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FastShipList from '../components/FastShipList';
import StandardShipList from '../components/StandardShipList'

const Tab = createMaterialTopTabNavigator();

export default function List() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, color: '#112D4E' },
                tabBarStyle: { backgroundColor: '#F9F7F7' },
            }}
        >
            <Tab.Screen name="FastList" component={FastShipList} options={{title: 'Giao hàng nhanh'}} />
            <Tab.Screen name="StandardList" component={StandardShipList} options={{title: 'Giao hàng tiêu chuẩn'}}/>
        </Tab.Navigator>
    )
}