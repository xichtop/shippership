import React, { useState, useEffect } from 'react';
import { LayoutAnimation, SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar } from 'react-native';
import {
    SwipeableFlatList,
    SwipeableQuickActionButton,
    SwipeableQuickActions,
} from 'react-native-swipe-list';
import { Button, Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import deliveryAPI from '../api/deliveryAPI';
import coordinationAPI from '../api/coordinationAPI';
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import numberWithCommas from '../utils/numberWithCommas'
import { showMessage } from "react-native-flash-message";

export default function List({ navigation }) {

    const token = useSelector(state => state.shipper.token);

    const staffId = useSelector(state => state.shipper.shipper.StaffId);

    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [colors, setColors] = useState([
        { type: 'solid', color: '#F9F7F7' },
        { type: 'outline', color: '#3F72AF' },
    ]);

    useEffect(() => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getStandardShipOrder(staffId, token);
                setData(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
    }, [])

    const handleOrdered = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getStandardShipOrder(staffId, token);
                setData(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'solid', color: '#F9F7F7' },
            { type: 'outline', color: '#3F72AF' },
        ])
    }
    const handleDeliver = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getStandardShipDeliver(staffId, token);
                setData(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'outline', color: '#3F72AF' },
            { type: 'solid', color: '#F9F7F7' },
        ])
    }

    const onRefresh = () => {
        setRefreshing(true);
        let newIndex = 0;
        colors.forEach((c, index) => {
            if (c.type === 'solid') newIndex = index
        })
        if (newIndex === 0) {
            const fetchListDeleiveries = async () => {
                try {
                    const deliveries = await deliveryAPI.getStandardShipOrder(staffId, token);
                    setData(deliveries);
                } catch (error) {
                    console.log("Failed to fetch provinces list: ", error);
                }
            }
            fetchListDeleiveries();
        }
        else if (newIndex === 1) {
            const fetchListDeleiveries = async () => {
                try {
                    const deliveries = await deliveryAPI.getStandardShipDeliver(staffId, token);
                    setData(deliveries);
                } catch (error) {
                    console.log("Failed to fetch provinces list: ", error);
                }
            }
            fetchListDeleiveries();
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 1000)
    };

    const hanldeConfirm = (deliveryId, Status) => {
        const fetchAddItem = async () => {
            var item = {
                StaffId: staffId,
                DeliveryId: deliveryId,
                Status: Status,
            }
            var result = null;
            try {
                result = await coordinationAPI.addStandardItem(item, token);

            } catch (error) {
                console.log("Failed to fetch add item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Tiếp nhận đơn hàng thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.navigate('List');
                }, 2000);
            } else {
                setTimeout(() => {
                    showMessage({
                        message: "Tiếp nhận đơn hàng thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.navigate('List');
                }, 2000);
            }
        }
        fetchAddItem();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                <Button
                    icon={<Icon name="rocket" size={15} color={colors[0].color} />}
                    title="Lấy Hàng"
                    type={colors[0].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[0].color}` }}
                    onPress={handleOrdered}
                    buttonStyle={{width: 160}}
                />
                <Button
                    icon={<Icon name="car-sport" size={15} color={colors[1].color} />}
                    title="Giao Hàng"
                    type={colors[1].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[1].color}` }}
                    onPress={handleDeliver}
                    buttonStyle={{width: 160}}
                />
            </View>
            <SwipeableFlatList
                data={data}
                renderItem={({ item }) =>
                    <View
                        style={{
                            width: '100%',
                            backgroundColor: '#F9F7F7',
                            borderColor: '#3F72AF',
                            borderWidth: 1,
                            marginBottom: 10,
                            padding: 10
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: '#112D4E' }}>ĐH{item.DeliveryId}/{item.ShipType === "Giao hàng nhanh" ? "GHN" : "GHTC"}</Text>
                        <Text>Thông tin người nhận</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Họ tên: {item.RecieverName}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Địa chỉ: {item.AddressDetail}, {item.WardNameStore}, {item.DistrictNameStore}, {item.ProvinceNameStore}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Số điện thoại: {item.RecieverPhone}</Text>
                        <Text>Thông tin người gửi</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Tên cửa hàng: {item.StoreName}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Địa chỉ: {item.StoreAddress}, {item.WardName}, {item.DistrictName}, {item.ProvinceName}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Số điện thoại: {item.StorePhone}</Text>
                        <Text>Thông tin đơn hàng</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>COD: {numberWithCommas(item.COD)}đ</Text>
                        <Tooltip
                            popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                            width={300}
                            backgroundColor='#3F72AF'
                        >
                            <Text style={{ fontSize: 16, paddingBottom: 10, color: '#3F72AF' }}>Ngày đặt hàng: {formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} trước</Text>
                        </Tooltip>
                        <Button title="Tiếp nhận đơn hàng"
                            onPress={() => hanldeConfirm(item.DeliveryId, item.Status)}
                            buttonStyle={{ backgroundColor: '#112D4E' }}
                        />
                    </View>
                }
                keyExtractor={item => item.DeliveryId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 200}}>
                        <Text>Hiện không có đơn hàng nào mới</Text>
                        <Text style={{paddingVertical: 10}}>trong khu vực của bạn</Text>
                        <Button title ="Xem khu vực"
                            onPress = {() => navigation.navigate('Area')} />
                    </View>
                }
                renderRightActions={({ item }) => (
                    <SwipeableQuickActions>
                        <SwipeableQuickActionButton
                            onPress={() => {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut,
                                );
                                // setData(data.filter(value => value.id !== item.id));
                                navigation.navigate('Detail', {
                                    deliveryId: item.DeliveryId,
                                })
                            }}
                            text="Xem Chi tiết"
                            textStyle={{ fontWeight: 'bold', color: '#F9F7F7' }}
                            style={{ backgroundColor: '#3F72AF', justifyContent: 'center', width: 120, height: '94%', }}
                        />
                    </SwipeableQuickActions>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '87%',
        justifyContent: 'center',
    },
    select: {
        fontSize: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3F72AF',
        borderRadius: 4,
        color: '#3F72AF',
        paddingRight: 30,
    },
})