import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements'
import { Table, Row } from 'react-native-table-component';
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import numberWithCommas from '../utils/numberWithCommas'
import paymentApi from '../api/paymentAPI';
import { showMessage } from "react-native-flash-message";
import { SearchBar } from 'react-native-elements';
const tableHead = ['Mã ĐH', 'Ngày đặt', 'Ngày giao', 'COD', 'Trạng thái'];
const widthArr = [44, 90, 90, 66, 70];
const DATA = [
    ['ĐH1', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH2', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH3', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
]

export default function FastMoney() {

    const staffId = useSelector(state => state.shipper.shipper.StaffId);

    const token = useSelector(state => state.shipper.token);

    const [data, setData] = useState(DATA);

    const [dataSearch, setDataSearch] = useState([]);

    const [total, setTotal] = useState(0);

    const [totalPay, setTotalPay] = useState(0);

    const [loading, setLoading] = useState(false);

    const [loadingPay, setLoadingPay] = useState(false);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
        const temp = data.filter(function (item) {
            return item[0].toString().indexOf(search) !== -1;
        })
        setDataSearch(temp);
    }

    const fetchStatistic = async () => {
        try {
            const item = {
                StaffId: staffId
            }
            const list = await paymentApi.getFastShipper(item, token);
            var tempList = [];
            var tempTotalPay = 0;
            var tempTotal = 0;
            list.forEach(item => {
                tempList.push([
                    item.DeliveryId,
                    format(new Date(item.OrderDate), 'dd-MM-yyyy'),
                    format(new Date(item.DeliveryDate), 'dd-MM-yyyy'),
                    numberWithCommas(item.COD),
                    item.Status
                ])
                if (item.Status === 'Đã thanh toán') {
                    tempTotalPay += parseInt(item.COD);
                    tempTotal += parseInt(item.COD);
                } else {
                    tempTotal += parseInt(item.COD);
                }
            })
            setData(tempList);
            setDataSearch(tempList);
            setTotalPay(tempTotalPay);
            setTotal(tempTotal);
        } catch (error) {
            console.log('Fetch Statistic failed', error);
        }
    }

    const handlePay = () => {
        const fetchPayCOD = async () => {
            var deliveries = [];
            data.forEach(item => {
                deliveries.push({
                    DeliveryId: item[0],
                    Status: item[4],
                })
            })
            const item = {
                Deliveries: deliveries,
                StaffId: staffId
            }
            var result = null;
            try {
                result = await paymentApi.payCODShipper(item, token);
            } catch (error) {
                console.log("Failed to fetch deliveries: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    setLoadingPay(false);
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Thanh toán COD thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            } else {
                setTimeout(() => {
                    setLoadingPay(false);
                    showMessage({
                        message: "Thanh toán COD thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            }
        }
        if (total - totalPay === 0) {
            Alert.alert('Bạn đã thanh toán toàn bộ tiền COD!!!');
        } else {
            setLoadingPay(true);
            fetchPayCOD();
            fetchStatistic();
        }
    }

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            fetchStatistic();
            setLoading(false);
        }, 1000)
    }

    useEffect(() => {
        fetchStatistic();
    }, [])

    return (
        <View>
            <SearchBar
                placeholder="Nhập mã đơn hàng..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48 }}
                inputContainerStyle={{ backgroundColor: '#DBE2EF', height: 24 }}
            />
            <View style={styles.container}>
                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={{ ...styles.text, color: 'white' }} />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                                {
                                    dataSearch.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={widthArr}
                                            style={[styles.row, index % 2 && { backgroundColor: '#F1ECC3' }]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.money}>
                <View style={{ marginLeft: 10 }}>
                    <Button title='Thanh toán'
                        onPress={handlePay}
                        buttonStyle={styles.button}
                        loading={loadingPay}
                    />
                    <Button title='Refresh'
                        onPress={handleRefresh}
                        buttonStyle={{ ...styles.button, backgroundColor: 'green' }} 
                        loading={loading}/>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.textmoney}>Tổng tiền: {numberWithCommas(total)} đ</Text>
                    <Text style={styles.textmoney}>Đã thanh toán: {numberWithCommas(totalPay)} đ</Text>
                    <Text style={styles.textmoney}>Còn lại: {numberWithCommas(total - totalPay)} đ</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', height: 420 },
    header: { height: 50, backgroundColor: '#112D4E' },
    text: { textAlign: 'center', fontWeight: '300', },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#C9D8B6' },
    money: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingRight: 10 },
    textmoney: { fontSize: 16, paddingBottom: 6 },
    button: {
        marginBottom: 10,
        borderRadius: 10,
    }
});