import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { useSelector } from 'react-redux'
import shipareaAPI from '../api/shipareaAPI'
const tableHead = ['Mã', 'Tên Quận/Huyện', 'Thao Tác',];
const widthArr = [70, 220, 70];
const DATA = [
    ['425', 'Thành phố Thủ Đức', '26-06-1999'],
    ['234', 'Quận Tân Bình', '26-06-1999'],
    ['123', 'Huyện Diễn Châu', '26-06-1999'],
]

export default function Area() {

    const staffId = useSelector(state => state.shipper.shipper.StaffId);

    const token = useSelector(state => state.shipper.token);

    const [data, setData] = useState(DATA);

    const hanldeRemove = (data) => {
        console.log(data);
    }

    const element = (data, index) => {
        return (
            <TouchableOpacity onPress={() => hanldeRemove(data)}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>Xóa</Text>
                </View>
            </TouchableOpacity>
        )
    };

    useEffect(() => {
        const fetchShipArea = async () => {
            try {
                const shipareas = await shipareaAPI.getByStaff(staffId, token);
                const temp = [];
                shipareas.forEach((ship) => {
                    temp.push([ship.DistrictCode, ship.DistrictName, 'xóa'])
                })
                setData(temp);
            } catch (error) {
                console.log('Failed to fetch list ship area', error);
            }
        }
        fetchShipArea();
    }, [])

    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderColor: 'blue' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.textHead} widthArr={widthArr} />
                {
                    data.map((rowData, index) => (
                        <TableWrapper key={index} style={[styles.row, index % 2 && { backgroundColor: '#F1ECC3' }]}>
                            {
                                rowData.map((cellData, cellIndex) => (
                                    <Cell key={cellIndex}
                                        data={cellIndex === 2 ? element(rowData, index) : cellData} textStyle={styles.text}
                                        width={cellIndex === 1 ? 220 : 70} />
                                ))
                            }
                        </TableWrapper>
                    ))
                }
            </Table>
            <Button title="Thêm khu vực"
                onPress={() => navigation.navigate('AddArea')}
                buttonStyle={{ backgroundColor: '#112D4E', width: 150, alignSelf: 'center', marginTop: 20 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    head: { height: 60, backgroundColor: '#112D4E' },
    textHead: { alignSelf: 'center', color: 'white' },
    text: { color: 'black', alignSelf: 'center', },
    row: { flexDirection: 'row', height: 60, backgroundColor: '#C9D8B6' },
    btn: { width: 58, height: 26, backgroundColor: '#FF4848', borderRadius: 5, alignItems: 'center' },
    btnText: { color: '#fff', paddingTop: 3 },
});