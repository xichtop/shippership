import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { Button, Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import coordinationAPI from '../api/coordinationAPI';
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import numberWithCommas from '../utils/numberWithCommas'
import statusWithCommas from '../utils/statusWithCommas'
import { showMessage } from "react-native-flash-message";
import { SearchBar } from 'react-native-elements';

import ModalReturn from './ModalReturn';

export default function List({ navigation }) {

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

    const [colors, setColors] = useState([
        { type: 'solid', color: '#F9F7F7' },
        { type: 'outline', color: '#3F72AF' },
        { type: 'outline', color: '#3F72AF' },
    ]);

    useEffect(() => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Order');
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
    }, [])

    const handleOrdered = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Order');
                setData(deliveries);
                setDataSearch(deliveries);
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
                const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Deliver');
                setData(deliveries);
                setDataSearch(deliveries);
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
                const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Back');
                setData(deliveries);
                setDataSearch(deliveries);
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
                    const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Order');
                    setData(deliveries);
                    setDataSearch(deliveries);
                } catch (error) {
                    console.log("Failed to fetch standard deliver list: ", error);
                }
            }
            fetchListDeleiveries();
        }
        else if (newIndex === 1) {
            const fetchListDeleiveries = async () => {
                try {
                    const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Deliver');
                    setData(deliveries);
                    setDataSearch(deliveries);
                } catch (error) {
                    console.log("Failed to fetch provinces list: ", error);
                }
            }
            fetchListDeleiveries();
        } else {
            const fetchListDeleiveries = async () => {
                try {
                    const deliveries = await coordinationAPI.getStandardShip(staffId, token, 'Back');
                    setData(deliveries);
                    setDataSearch(deliveries);
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

    const hanldeMoveWareHouse = (deliveryId) => {
        const fetchUpdateItem = async () => {
            var item = {
                StaffId: staffId,
                DeliveryId: deliveryId,
                Status: 'Order'
            }
            var result = null;
            try {
                result = await coordinationAPI.updateStandardItem(item, token);

            } catch (error) {
                console.log("Failed to fetch update item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "X??c nh???n ????n h??ng v??? kho th??nh c??ng",
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
                        message: "X??c nh???n ????n h??ng v??? kho th???t b???i",
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
        fetchUpdateItem();
    }

    const hanldeDelivered = (deliveryId) => {
        const fetchUpdateItem = async () => {
            var item = {
                StaffId: staffId,
                DeliveryId: deliveryId,
                Status: 'Deliver'
            }
            var result = null;
            try {
                result = await coordinationAPI.updateStandardItem(item, token);

            } catch (error) {
                console.log("Failed to fetch update item: ", error);
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
        fetchUpdateItem();
    }

    const hanldeReturned = (deliveryId) => {
        const fetchUpdateItem = async () => {
            var item = {
                StaffId: staffId,
                DeliveryId: deliveryId,
                Status: 'Back'
            }
            var result = null;
            try {
                result = await coordinationAPI.updateStandardItem(item, token);

            } catch (error) {
                console.log("Failed to fetch update item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "X??c nh???n tr??? h??ng th??nh c??ng",
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
                        message: "X??c nh???n tr??? h??ng th???t b???i",
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
        fetchUpdateItem();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBotom: 5, marginTop: 100 }}>
                <Button
                    icon={<Icon name="rocket" size={15} color={colors[0].color} />}
                    title="L???y H??ng"
                    type={colors[0].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[0].color}` }}
                    onPress={handleOrdered}
                    buttonStyle={{ width: 110 }}
                />
                <Button
                    icon={<Icon name="car-sport" size={15} color={colors[1].color} />}
                    title="Giao H??ng"
                    type={colors[1].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[1].color}` }}
                    onPress={handleDeliver}
                    buttonStyle={{ width: 110 }}
                />
                <Button
                    icon={<Icon name="play-back-circle" size={15} color={colors[2].color} />}
                    title="Tr??? H??ng"
                    type={colors[2].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[2].color}` }}
                    onPress={handleBack}
                    buttonStyle={{ width: 110 }}
                />
            </View>
            <SearchBar
                placeholder="Nh???p s??? ??i???n tho???i ng?????i nh???n..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48 }}
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
                                    backgroundColor: "green",
                                    borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5
                                }}>
                                    <Text style={{ color: '#F9F7F7', fontSize: 14 }}>{statusWithCommas(item.StatusDetail)}</Text>
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
                                    <Text style={{ fontSize: 14, paddingLeft: 10 }}>Ng??y ti???p nh???n: {formatDistance(addHours(new Date(item.DeliveryDate), -7), new Date(), { locale: vi })} tr?????c</Text>
                                </Tooltip>
                            </View>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>Thu h??? COD</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: '#112D4E', fontWeight: 'bold', paddingRight: 10 }}>{numberWithCommas(parseInt(item.COD))} ??</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Detail', {
                                            deliveryId: item.DeliveryId
                                        })}
                                    >
                                        <Icon name="chevron-forward" size={20} color='#112D4E' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {item.StatusDetail === 'Da tiep nhan' ?
                                <Button title="X??c nh???n ??ang v??? kho"
                                    onPress={() => hanldeMoveWareHouse(item.DeliveryId)}
                                    buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10 }}
                                />
                                :
                                <View></View>
                            }
                            {item.StatusDetail === 'Da roi kho' && colors[1].type === 'solid' ?
                                <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                    <Button title="X??c nh???n ???? giao h??ng"
                                        onPress={() => hanldeDelivered(item.DeliveryId)}
                                        buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10, marginRight: 5 }}
                                    />
                                    <Button title="Kh??ng nh???n h??ng"
                                        onPress={() => setModalVisiable(true)}
                                        buttonStyle={{ backgroundColor: '#FF4848', borderRadius: 15, marginBottom: 10 }}
                                    />
                                    <ModalReturn visible={modalVisiable} setVisible={setModalVisiable} deliveryId={item.DeliveryId} onRefresh={onRefresh} Type='Standard' />

                                </View>
                                :
                                <View>
                                </View>
                            }

                            {item.StatusDetail === 'Da roi kho' && colors[2].type === 'solid' ?
                                <Button title="X??c nh???n ???? tr??? h??ng"
                                    onPress={() => hanldeReturned(item.DeliveryId)}
                                    buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 15, marginBottom: 10 }}
                                />
                                :
                                <View>
                                </View>
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
    );
};

const styles = StyleSheet.create({
    container: {
        height: '75%',
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