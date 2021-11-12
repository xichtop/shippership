import React, { useState, useEffect } from 'react'
import { LayoutAnimation, SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar, Alert } from 'react-native';
import {
    SwipeableFlatList,
    SwipeableQuickActionButton,
    SwipeableQuickActions,
} from 'react-native-swipe-list';
import { Button, Tooltip } from 'react-native-elements';
import coordinationAPI from '../api/coordinationAPI';
import { showMessage } from "react-native-flash-message";
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import numberWithCommas from '../utils/numberWithCommas'
import { SearchBar } from 'react-native-elements';

export default function FastShip({ navigation }) {

    const token = useSelector(state => state.shipper.token);

    const staffId = useSelector(state => state.shipper.shipper.StaffId);

    const [data, setData] = useState([]);

    const [dataSearch, setDataSearch] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
        const temp = data.filter(function (item) {
            return item.RecieverPhone.indexOf(search) !== -1
        })
        setDataSearch(temp);
    }

    useEffect(() => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await coordinationAPI.getFastShip(staffId, token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
    }, [])

    const onRefresh = () => {

        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await coordinationAPI.getFastShip(staffId, token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        setRefreshing(true);
        fetchListDeleiveries();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000)
    };

    const hanldeConfirm = (deliveryId) => {
        const fetchupdateItem = async () => {
            var item = {
                StaffId: staffId,
                DeliveryId: deliveryId,
            }
            var result = null;
            try {
                result = await coordinationAPI.updateFastItem(item, token);

            } catch (error) {
                console.log("Failed to fetch add item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Xác nhận giao hàng thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    onRefresh();
                }, 2000);
            } else {
                setTimeout(() => {
                    showMessage({
                        message: "Xác nhận giao hàng thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    onRefresh();
                }, 2000);
            }
        }
        fetchupdateItem();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#112D4E" />
            <SearchBar
                placeholder="Tìm kiếm đơn hàng theo số điện thoại..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48 }}
                inputContainerStyle={{ backgroundColor: '#DBE2EF', height: 24 }}
            />
            <SwipeableFlatList
                data={dataSearch}
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
                            <Text style={{ fontSize: 16, color: '#3F72AF' }}>Ngày đặt hàng: {formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} trước</Text>
                        </Tooltip>
                        <Tooltip
                            popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                            width={300}
                            backgroundColor='#3F72AF'
                        >
                            <Text style={{ fontSize: 16, paddingBottom: 10 }}>Ngày tiếp nhận: {formatDistance(addHours(new Date(item.DeliveryDate), -7), new Date(), { locale: vi })} trước</Text>
                        </Tooltip>
                        <Text style={{ fontSize: 16, color: '#3F72AF', paddingBottom: 10}}>Trạng thái đơn hàng: {item.Status === 'Delivering' ? 'Đang giao hàng' : 'Đã giao hàng'}</Text>
                        {item.Status === 'Delivering' ?
                            <Button title="Xác nhận đã giao hàng"
                                onPress={() => hanldeConfirm(item.DeliveryId)}
                                buttonStyle={{ backgroundColor: '#112D4E' }}
                            />
                            :
                            <View></View>
                        }
                    </View>
                }
                keyExtractor={item => item.DeliveryId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderRightActions={({ item }) => (
                    <SwipeableQuickActions>
                        <SwipeableQuickActionButton
                            onPress={() => {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut,
                                );
                                // setData(data.filter(value => value.id !== item.id));
                                // navigation.navigate('Detail', {
                                //     deliveryId: item.DeliveryId,
                                // })
                                Alert.alert('abc');
                            }}
                            text="Xem Chi Tiết"
                            textStyle={{ fontWeight: 'bold', color: '#F9F7F7' }}
                            style={{ backgroundColor: '#3F72AF', justifyContent: 'center', width: 120, height: '94%', }}
                        />
                    </SwipeableQuickActions>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '92%',
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