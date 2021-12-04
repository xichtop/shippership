import React from 'react';
import { Button } from 'react-native-elements'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch } from 'react-redux'
import { logout } from '../slice/shipperSlice'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import Home from '../screens/Home'
import Money from '../screens/Money'
import Profile from '../screens/Profile'
import List from '../screens/List'
import Area from '../screens/Area'
import NewList from '../screens/NewList'
import FeeShip from '../screens/FeeShip'
import Login from '../components/Login'
import Register from '../components/Register'
import Bank from '../components/Bank'
import Identity from '../components/Identity'
import DeliveryDetail from '../components/DeliveryDetail'
import AddArea from '../components/AddArea'

const ListStack = createNativeStackNavigator();
const NewListStack = createNativeStackNavigator();
const AreaStack = createNativeStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const ListScreen = () => {
    return (
        <ListStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            }}>
            <ListStack.Screen name='ListIndex' component={List} options={{ title: 'Danh Sách Đơn Giao' }} />
            <ListStack.Screen name='Detail' component={DeliveryDetail} options={{ title: 'Chi Tiết Đơn Giao' }} />
        </ListStack.Navigator>
    )
}

const NewListScreen = () => {
    return (
        <NewListStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            }}>
            <NewListStack.Screen name='NewListIndex' component={NewList} options={{ title: 'Danh Sách Đơn Hàng' }} />
            <NewListStack.Screen name='Detail' component={DeliveryDetail} options={{ title: 'Chi Tiết Đơn Hàng' }} />
        </NewListStack.Navigator>
    )
}

const AreaScreen = () => {
    return (
        <AreaStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            }}>
            <AreaStack.Screen name='AreaIndex' component={Area} options={{ title: 'Danh Sách Khu Vực' }} />
            <AreaStack.Screen name='AddArea' component={AddArea} options={{ title: 'Thêm Khu Vực' }} />
        </AreaStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

const Tabs = ({navigation}) => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        const action = logout();
        dispatch(action);
        navigation.navigate('Login');
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: '#F9F7F7',
                    borderRadius: 5,
                    height: 55,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Index') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                        size = 25
                    }
                    else if (route.name === 'List') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                        size = 25
                    }
                    else if (route.name === 'Area') {
                        iconName = focused ? 'compass' : 'compass-outline';
                        size = 25
                    }
                    else if (route.name === 'Fee') {
                        iconName = focused ? 'cash' : 'cash-outline';
                        size = 25
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                        size = 25
                    }
                    else if (route.name === 'Money') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                        size = 25
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#112D4E',
                tabBarInactiveTintColor: '#112D4E',

                //headers 
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            })}
        >
            <Tab.Screen name='Index' component={NewListScreen} options={{ tabBarLabel: 'Đơn Hàng Mới', headerShown: false }} />
            <Tab.Screen name='List' component={ListScreen} options={{ tabBarLabel: 'Đơn Giao', headerShown: false }} />
            <Tab.Screen name='Area' component={AreaScreen} options={{ tabBarLabel: 'Khu Vực', headerShown: false }} />
            <Tab.Screen name='Fee' component={FeeShip} options={{ tabBarLabel: 'Phí GH', title: 'Phí Giao Hàng' }} />
            <Tab.Screen name='Money' component={Money} options={{ tabBarLabel: 'Dòng Tiền', title: 'Dòng Tiền' }} />
            <Tab.Screen name='Profile' component={Profile} options={{
                tabBarLabel: 'Tài Khoản', title: 'Tài Khoản',
                headerRight: () => (
                    <Button
                        onPress={handleLogout}
                        title="Đăng xuất"
                        titleStyle={{color: "#F9F7F7"}}
                        type = 'clear'
                    />
                ),
            }} />
        </Tab.Navigator>
    )
}

const AppStack = createNativeStackNavigator();

const Navigators = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <AppStack.Screen name='Home' component={Tabs} options={{ headerShown: false }} />
            <AppStack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <AppStack.Screen name='Bank' component={Bank} options={{ headerShown: false }} />
            <AppStack.Screen name='Identity' component={Identity} options={{ headerShown: false }} />
        </AppStack.Navigator>
    )
}

// Di chuyển login lên trên để yêu cầu đâng nhập trước khi vào app

// const styles = StyleSheet.create({
//     shadow: {
//         shadowColor: '#14279B',
//         shadowOffset: {
//             width: 0,
//             height: 10
//         },
//         shadowOpacity: 0.5,
//         shadowRadius: 3.5,
//         elevation: 5
//     }
// })

export default Navigators