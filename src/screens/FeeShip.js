import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { Table, Row } from 'react-native-table-component';
import { useSelector } from 'react-redux'
import { format, addDays } from 'date-fns'
import numberWithCommas from '../utils/numberWithCommas'
import feeshipAPI from '../api/feeshipAPI';
import { SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
const tableHead = ['Mã ĐH', 'Loại', 'Ngày', 'Phí GH', 'Trạng thái'];
const widthArr = [48, 70, 80, 66, 100];
const DATA = [
    ['ĐH1', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH2', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH3', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
]

export default function FeeShip() {

    const StaffId = useSelector(state => state.shipper.shipper.StaffId);

    const token = useSelector(state => state.shipper.token);

    const [data, setData] = useState(DATA);

    const [dataSearch, setDataSearch] = useState([]);

    const [firstDate, setFirstDate] = useState(addDays(new Date(), -29));

    const [lastDate, setLastDate] = useState(addDays(new Date(), 1));

    const [showFirst, setShowFirst] = useState(false);

    const [showLast, setShowLast] = useState(false);

    const [total, setTotal] = useState(0);

    const [totalPay, setTotalPay] = useState(0);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
        const temp = data.filter(function (item) {
            return item[0].toString().indexOf(search) !== -1;
        })
        setDataSearch(temp);
    }

    const onFirstDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || firstDate;
        setFirstDate(currentDate);
        setShowFirst(false);
    };

    const onLastDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastDate;
        setLastDate(currentDate);
        setShowLast(false);
    };

    const fetchStatistic = async () => {
        try {
            const item = {
                FirstDate: firstDate,
                LastDate: lastDate,
                StaffId: StaffId
            }
            const list = await feeshipAPI.getAllByStaff(item, token);
            var tempList = [];
            var tempTotalPay = 0;
            var tempTotal = 0;
            list.forEach(item => {
                tempList.push([
                    item.DeliveryId,
                    item.Type,
                    format(new Date(item.DeliveryDate), 'dd-MM-yyyy'),
                    numberWithCommas(item.FeeShip),
                    item.Status
                ])
                if (item.Status === 'Đã thanh toán') {
                    tempTotalPay += parseInt(item.FeeShip);
                    tempTotal += parseInt(item.FeeShip);
                } else {
                    tempTotal += parseInt(item.FeeShip);
                }
            })
            setData(tempList);
            setDataSearch(tempList);
            setTotalPay(tempTotalPay);
            setTotal(tempTotal);
            setLoading(false);
        } catch (error) {
            console.log('Fetch Statistic failed', error);
        }
    }

    useEffect(() => {
        fetchStatistic();
    }, [])

    const hanldeFilter = () => {
        setLoading(true);
        fetchStatistic();
    }

    return (
        <View>
            <Text style={{ fontSize: 18, color: '#112D4E', fontWeight: 'bold', paddingVertical: 10, alignSelf: 'center' }}>Thống Kê Phí Giao Hàng</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, justifyContent: 'center', paddingBottom: 10 }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Button title='Từ Ngày'
                            onPress={() => setShowFirst(true)}
                            titleStyle={{ fontSize: 10 }}
                            buttonStyle={{ width: 70, borderRadius: 3 }}
                        />
                        <Text style = {{fontSize: 12}}> : {format(new Date(firstDate), 'dd-MM-yyyy')}</Text>
                        {showFirst && (
                            <DateTimePicker
                                testID="dateTimePicker1"
                                value={firstDate}
                                mode='date'
                                onChange={onFirstDateChange}
                                locale='vi-VN'
                            />
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                        <Button title='Đến ngày'
                            onPress={() => setShowLast(true)}
                            titleStyle={{ fontSize: 10 }}
                            buttonStyle={{ width: 70, borderRadius: 3 }}
                        />
                        <Text style = {{fontSize: 12}}> : {format(new Date(lastDate), 'dd-MM-yyyy')}</Text>
                        {showLast && (
                            <DateTimePicker
                                testID="dateTimePicker2"
                                value={lastDate}
                                mode='date'
                                onChange={onLastDateChange}
                                locale='vi-VN'
                            />
                        )}

                    </View>
                <Button title='Lọc'
                    onPress={hanldeFilter}
                    titleStyle={{ fontSize: 12 }}
                    buttonStyle={{ width: 50, borderRadius: 6 }}
                    loading={loading}
                />
            </View>
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
                <Text style={styles.textmoney}>Tổng tiền: {numberWithCommas(total)} đ</Text>
                <Text style={styles.textmoney}>Đã thanh toán: {numberWithCommas(totalPay)} đ</Text>
                <Text style={styles.textmoney}>Còn lại: {numberWithCommas(total - totalPay)} đ</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', height: 390 },
    header: { height: 50, backgroundColor: '#112D4E' },
    text: { textAlign: 'center', fontWeight: '300', },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#C9D8B6' },
    money: { alignItems: 'flex-end', paddingTop: 10, paddingRight: 10 },
    textmoney: { fontSize: 16, paddingBottom: 5 }
});