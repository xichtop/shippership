import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar, TouchableOpacity, FlatList } from 'react-native';
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
            { type: 'outline', color: '#3F72AF' },
        ])
    }

    const handleBack = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getStandardShipBack(staffId, token);
                setData(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'outline', color: '#3F72AF' },
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
                    onRefresh();
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
                    // navigation.navigate('List');
                    onRefresh();
                }, 2000);
            }
        }
        fetchAddItem();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 55, paddingBottom: 5 }}>
                <Button
                    icon={<Icon name="rocket" size={15} color={colors[0].color} />}
                    title="Lấy Hàng"
                    type={colors[0].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[0].color}` }}
                    onPress={handleOrdered}
                    buttonStyle={{ width: 110 }}
                />
                <Button
                    icon={<Icon name="car-sport" size={15} color={colors[1].color} />}
                    title="Giao Hàng"
                    type={colors[1].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[1].color}` }}
                    onPress={handleDeliver}
                    buttonStyle={{ width: 110 }}
                />
                <Button
                    icon={<Icon name="play-back-circle" size={15} color={colors[2].color} />}
                    title="Trả Hàng"
                    type={colors[2].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[2].color}` }}
                    onPress={handleBack}
                    buttonStyle={{ width: 110 }}
                />
            </View>
            <View style={{ alignItems: 'center', width: '100%' }}>
                <FlatList
                    data={data}
                    renderItem={({ item }) =>
                        <View
                            style={{
                                width: '94%',
                                backgroundColor: 'white',
                                borderRadius: 15,
                                marginBottom: 10,
                                paddingHorizontal: 20,
                                alignSelf: 'center'
                            }}
                        >
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>{item.ShipType === "Giao hàng nhanh" ? "GHN" : "GHTC"} - ĐH{item.DeliveryId}</Text>
                                <View style={{
                                    backgroundColor: item.ShipType === "Giao hàng nhanh" ? "#1C7947" : "#112D4E",
                                    borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5
                                }}>
                                    <Text style={{ color: '#F9F7F7', fontSize: 14 }}>{item.ShipType}</Text>
                                </View>
                            </View>
                            <Text style={{ color: '#3F72AF' }}>Người gửi</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: '#112D4E' }}>{item.StoreName} | {item.StorePhone}</Text>
                            <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="golf" size={20} color='#D98C00' />
                                <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>{item.StoreAddress}, {item.WardNameStore}, {item.DistrictNameStore}, {item.ProvinceNameStore}</Text>
                            </View>
                            <Text style={{ color: '#3F72AF' }}>Người nhận</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: '#112D4E' }}>{item.RecieverName} | {item.RecieverPhone}</Text>
                            <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="golf" size={20} color='#D98C00' />
                                <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>{item.AddressDetail}, {item.WardName}, {item.DistrictName}, {item.ProvinceName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="timer" size={20} color='green' />
                                <Tooltip
                                    popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                                    width={300}
                                    backgroundColor='#3F72AF'
                                >
                                    <Text style={{ fontSize: 14, paddingLeft: 10 }}>{formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} trước</Text>
                                </Tooltip>
                            </View>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>Thu hộ COD</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: '#112D4E', fontWeight: 'bold', paddingRight: 10 }}>{numberWithCommas(parseInt(item.COD))} đ</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Detail', {
                                            deliveryId: item.DeliveryId
                                        })}
                                    >
                                        <Icon name="chevron-forward" size={20} color='#112D4E' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Button title="Tiếp nhận đơn hàng"
                                onPress={() => hanldeConfirm(item.DeliveryId, item.Status)}
                                buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10 }}
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
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 200 }}>
                            <Text>Hiện không có đơn hàng nào mới</Text>
                            <Text style={{ paddingVertical: 10 }}>trong khu vực của bạn</Text>
                            <Button title="Xem khu vực"
                                onPress={() => navigation.navigate('Area')}
                                buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10 }} />
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '83%',
        justifyContent: 'center',
        backgroundColor: '#E8EAE6',
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