import React, { useState, useEffect } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { Button, Tooltip } from 'react-native-elements';
import coordinationAPI from '../api/coordinationAPI';
import returnAPI from '../api/returnAPI'
import { showMessage } from "react-native-flash-message";
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import numberWithCommas from '../utils/numberWithCommas'
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

import statusFast from '../utils/statusFast'

import ModalReturn from './ModalReturn';

export default function FastShipList({ navigation }) {

    const token = useSelector(state => state.shipper.token);

    const staffId = useSelector(state => state.shipper.shipper.StaffId);

    const [data, setData] = useState([]);

    const [dataSearch, setDataSearch] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState('');

    const [modalVisiable, setModalVisiable] = useState(false);

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
                        description: "X??c nh???n giao h??ng th??nh c??ng",
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
                        message: "X??c nh???n giao h??ng th???t b???i",
                        description: "Vui l??ng th??? l???i sau",
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

    const hanldeReturn = (deliveryId) => {
        const fetchReturn = async () => {
            var item = {
                DeliveryId: deliveryId
            }
            var result = null;
            try {
                result = await returnAPI.returned(item, token);

            } catch (error) {
                console.log("Failed to fetch add item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "X??c nh???n ???? tr??? h??ng th??nh c??ng",
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
                        message: "X??c nh???n ???? tr??? h??ng th???t b???i",
                        description: "Vui l??ng th??? l???i sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    onRefresh();
                }, 2000);
            }
        }
        fetchReturn();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#112D4E" />
            <SearchBar
                placeholder="Nh???p s??? ??i???n tho???i ng?????i nh???n..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48, paddingTop: 40, paddingBottom: 32 }}
                inputContainerStyle={{ backgroundColor: '#DBE2EF', height: 24 }}
            />
            <View style={{ alignItems: 'center', width: '100%', }}>
                <FlatList
                    data={dataSearch}
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
                                <Text style={{ color: 'gray', fontSize: 16 }}>{item.ShipType === "Giao h??ng nhanh" ? "GHN" : "GHTC"} - ??H{item.DeliveryId}</Text>
                                <View style={{
                                    backgroundColor: "#1C7947",
                                    borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5
                                }}>
                                    <Text style={{ color: '#F9F7F7', fontSize: 14 }}>{statusFast(item.Status)}</Text>
                                </View>
                            </View>
                            <Text style={{ color: '#3F72AF' }}>Ng?????i g???i</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: '#112D4E' }}>{item.StoreName} | {item.StorePhone}</Text>
                            <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="golf" size={20} color='#D98C00' />
                                <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>{item.StoreAddress}, {item.WardNameStore}, {item.DistrictNameStore}, {item.ProvinceNameStore}</Text>
                            </View>
                            <Text style={{ color: '#3F72AF' }}>Ng?????i nh???n</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: '#112D4E' }}>{item.RecieverName} | {item.RecieverPhone}</Text>
                            <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="golf" size={20} color='#D98C00' />
                                <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>{item.AddressDetail}, {item.WardName}, {item.DistrictName}, {item.ProvinceName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="time" size={20} color='green' />
                                <Tooltip
                                    popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                                    width={300}
                                    backgroundColor='#3F72AF'
                                >
                                    <Text style={{ fontSize: 14, paddingLeft: 10 }}>Ng??y ?????t h??ng: {formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} tr?????c</Text>
                                </Tooltip>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="timer" size={20} color='red' />
                                <Tooltip
                                    popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatDistance(addHours(new Date(item.DeliveryDate), -7), new Date(), { locale: vi })} tr?????c</Text>}
                                    width={300}
                                    backgroundColor='#3F72AF'
                                >
                                    <Text style={{ fontSize: 14, paddingLeft: 10 }}>Ng??y ti???p nh???n: {formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} tr?????c</Text>
                                </Tooltip>
                            </View>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>Thu h??? COD</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Detail', {
                                        deliveryId: item.DeliveryId
                                    })}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 16, color: '#112D4E', fontWeight: 'bold', paddingRight: 10 }}>{numberWithCommas(parseInt(item.COD))} ??</Text>

                                        <Icon name="chevron-forward" size={20} color='#112D4E' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {item.Status === 'Delivering' ?
                                <View style={{ flexDirection: 'row', marginLeft: -5 }}>
                                    <Button title="X??c nh???n giao h??ng"
                                        onPress={() => hanldeConfirm(item.DeliveryId)}
                                        buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10, marginRight: 10 }}
                                    />
                                    <Button title="Kh??ng nh???n h??ng"
                                        onPress={() => setModalVisiable(true)}
                                        buttonStyle={{ backgroundColor: '#FF4848', borderRadius: 15, marginBottom: 10 }}
                                    />
                                    <ModalReturn visible={modalVisiable} setVisible={setModalVisiable} deliveryId={item.DeliveryId} onRefresh={onRefresh} Type='Fast' />
                                </View>
                                :
                                <View></View>
                            }

                            {item.Status === 'Returning' ?
                                <Button title="X??c nh???n ???? tr??? h??ng"
                                    onPress={() => hanldeReturn(item.DeliveryId)}
                                    buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10, marginRight: 10 }}
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
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '82%',
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