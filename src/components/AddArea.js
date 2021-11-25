import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import shipareaAPI from '../api/shipareaAPI';
import districtAPI from '../api/districtAPI';
import MultiSelect from 'react-native-multiple-select';
import {useSelector} from 'react-redux';
import { showMessage } from "react-native-flash-message";
import { Table, Row, Rows } from 'react-native-table-component';
const tableHead = ['Mã Quận/Huyện', 'Tên Quận/Huyện'];
const widthArr = [120, 220]

export default function AddArea({ route, navigation }) {

    const StaffId = useSelector(state => state.shipper.shipper.StaffId);

    const token = useSelector(state => state.shipper.token);

    const { districtCurrents } = route.params;

    const [data, setData] = useState([]);

    const [districtCodes, setDistrictCodes] = useState([]);

    const [dataTable, setDataTable] = useState([]);

    const onSelectedItemsChange = (selectedItems) => {
        setDistrictCodes(selectedItems);
        const temp = [];
        console.log(selectedItems);
        selectedItems.forEach(item => {
            const district = data.find(dis => dis.id === item);
            console.log(district);
            temp.push([district.id, district.name]);
        }
        )
        setDataTable(temp);
    }

    useEffect(() => {
        const fetctDistricts = async () => {
            try {
                const temp = [];
                const districts = await districtAPI.getByProvice('79');
                function checkDistrict(value) {
                    const index = districtCurrents.findIndex(item => item[0] === value.DistrictCode);
                    if (index !== -1) {
                        return false;
                    } else {
                        return true;
                    }
                }
                const tempList = districts.filter(checkDistrict)
                // console.log(tempList);
                tempList.forEach(district => {
                    temp.push({
                        id: district.DistrictCode,
                        name: district.DistrictName,
                    })
                })
                setData(temp);
            } catch (error) {
                console.error(error);
            }
        }
        fetctDistricts();
    }, [])

    const hamldeConfirm = () => {
        const fetchAddShipArea = async () => {
            const item = {
                StaffId: StaffId,
                districts: dataTable
            }
            var result = null;
            try {
                result = await shipareaAPI.addItem(item, token);

            } catch (error) {
                console.log("Failed to fetch remove item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Thêm khu vực thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.goBack();
                }, 2000);
            } else {
                setTimeout(() => {
                    showMessage({
                        message: "Thêm khu vực thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.goBack();
                }, 2000);
            }
        }
        if (dataTable.length === 0) {
            Alert.alert('Vui lòng chọn khu vực')
        } else {
            fetchAddShipArea();
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vui lòng chọn quận/huyện bạn muốn đăng ký</Text>
            <MultiSelect
                hideTags
                items={data}
                uniqueKey="id"
                // single={true}
                // ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={districtCodes}
                selectText="Chọn quận/huyện"
                searchInputPlaceholderText="Nhập tên quận/huyện..."
                // onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                styleDropdownMenu={{ width: 330, borderRadius: 5 }}
                // styleDropdownMenuSubsection={{width: 350}}
                styleListContainer={{ width: 330 }}
                fixedHeight={true}
                noItemsText="Không có quận/huyện nào phù hợp"
                hideSubmitButton={true}
                hideDropdown={true}
            />
            <View style={{}}>
                <Text style={{ paddingVertical: 10, fontSize: 16 }}>Danh sách các quận/huyện đã chọn</Text>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                    <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={styles.text} />
                    <Rows data={dataTable}
                        textStyle={styles.text}
                        style={[styles.row]}
                        widthArr={widthArr}
                    />
                </Table>
                <Button onPress={hamldeConfirm}
                    title = "Đăng ký"
                    buttonStyle={styles.button}
                    />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 15,
        alignSelf: 'flex-start',
        fontWeight: "bold",
        color: '#3F72AF',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingTop: 10
    },
    button: {
        backgroundColor: '#3F72AF',
        color: 'black',
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40,
        marginTop: 30,
        alignSelf: 'center'
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { color: 'black', alignSelf: 'center', },
    row: { flexDirection: 'row', height: 40, backgroundColor: '#C9D8B6' },
});