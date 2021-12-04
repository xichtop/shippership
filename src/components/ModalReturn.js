import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Input, Button } from 'react-native-elements';
import returnAPI from '../api/returnAPI'
import { useSelector } from 'react-redux'
import { showMessage } from "react-native-flash-message";


const schema = yup.object().shape({
    reason: yup.string().required('Lí do không được để trống'),
}).required();

export default function ModalReturn(props) {

    const token = useSelector(state => state.shipper.token);

    const { visible, setVisible, deliveryId, onRefresh, Type } = props;

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data) => {
        let Status = '';
        if (Type === 'Fast') {
            Status = 'Fast'
        } else {
            Status = 'Standard'
        }
        setIsLoading(true);
        const fetchReturn = async () => {
            var item = {
                DeliveryId: deliveryId,
                Reason: data.reason,
                Status: Status
            }
            var result = null;
            try {
                result = await returnAPI.confirm(item, token);

            } catch (error) {
                console.log("Failed to fetch add item: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Xác nhận trả hàng thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    setIsLoading(false);
                    setVisible(false);
                    onRefresh();
                }, 2000);
            } else {
                setTimeout(() => {
                    showMessage({
                        message: "Xác nhận trả hàng thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    setIsLoading(false);
                    setVisible(false);
                    onRefresh();
                }, 2000);
            }
        }
        fetchReturn();
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => {
                    setVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Xác Nhận Không nhận Hàng</Text>
                        <View style={styles.controler}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder='Nhập lí do khách hàng không nhận hàng...'
                                        // label='Lí do'
                                        // leftIcon={
                                        //     <Icon
                                        //         name='person-circle'
                                        //         size={24}
                                        //         color='#F9F7F7'
                                        //     />
                                        // }
                                        labelStyle={{ color: '#F9F7F7' }}
                                        inputStyle={{ fontSize: 15, color: 'white' }}
                                        inputContainerStyle={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.reason ? errors.reason.message : ''}
                                    />
                                )}
                                name="reason"
                                defaultValue=""
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: -10}}>
                            <Button
                                title="Xác nhận"
                                buttonStyle={styles.button}
                                titleStyle={{color: '#112D4E'}}
                                onPress={handleSubmit(onSubmit)}
                                loading={isLoading}
                            />
                            <Button
                                title="Hủy"
                                buttonStyle={{ ...styles.button, backgroundColor: '#FF0000'}}
                                titleStyle={{color: '#112D4E'}}
                                onPress={() => { setVisible(false); }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        // alignItems: "center",
    },
    modalView: {
        backgroundColor: "#112D4E",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    controler: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
    },
    button: {
        backgroundColor: '#49FF00',
        borderRadius: 10,
        marginHorizontal: 10,
        width: 150,
        height: 40
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: '#F9F7F7',
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        height: 30,
    },
});
