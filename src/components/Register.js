import React, { useState } from "react";
import {
    Text, View, StyleSheet,
    ScrollView, Alert
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Icon from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import shipperAPI from '../api/shipperAPI';
import TakePhoto from './TakePhoto';
import { useDispatch } from 'react-redux';
import { create } from '../slice/registerSlice';
import StepIndicator from 'react-native-step-indicator';
const labels = ["Thông Tin", "Ngân Hàng", "CCCD"];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#112D4E',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#112D4E',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#112D4E',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#112D4E',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#112D4E',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#112D4E'
}
const schema = yup.object().shape({
    username: yup.string().strict(true).trim('Tên đăng nhập không được chứa khoảng trắng').required('Tên đăng nhập không được để trống'),
    password: yup.string().strict(true).trim('Mật khẩu không được chứa khoảng trắng').required('Mật khẩu không được để trống'),
    rePassword: yup.string().strict(true)
        .oneOf([yup.ref('password'), null], "Mật khẩu không trùng nhau!")
        .trim('Mật khẩu không được chứa khoảng trắng').required('Mật khẩu không được để trống'),
    name: yup.string().required('Tên cửa hàng không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    email: yup.string().required('Email không được để trống'),
    address: yup.string().required('Địa chỉ không được để trống'),
}).required();

export default function Post({ navigation }) {

    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const dispatch = useDispatch();

    const [img, setImg] = useState('https://us.123rf.com/450wm/dirkercken/dirkercken1403/dirkercken140300029/26322661-photos-bouton-image-et-la-photo-galerie-ic%C3%B4ne.jpg?ver=6');

    const handleGetImg = (image) => {
        console.log(image);
        setImg(image);
    }

    const onSubmit = (data) => {

        const fetchStores = async () => {
            try {
                const accounts = await shipperAPI.check(data.username);
                if (accounts.length > 0) {
                    setError("username", {
                        type: "manual",
                        message: "Tên đăng nhập đã tồn tại!",
                    });
                }
                else if (img === 'https://static.thenounproject.com/png/396915-200.png') {
                    Alert.alert('Vui lòng tải ảnh lên');
                }
                else {
                    const shipper = {
                        Username: data.username,
                        Password: data.password,
                        Email: data.email,
                        FullName: data.name,
                        Phone: data.phone,
                        AddressDetail: data.address,
                        Picture: img,
                    }
                    const action = create({
                        shipper
                    })
                    dispatch(action);
                    navigation.navigate('Bank')
                }
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchStores();
    }
    return (
        <View style={{ marginTop: 10 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
                    <View style={{ width: '100%' }}>
                        <StepIndicator
                            customStyles={customStyles}
                            stepCount={3}
                            currentPosition={0}
                            labels={labels}
                        />
                    </View>
                    <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                        <Text style={{ fontSize: 15, color: '#112D4E' }}>Thông tin nhân viên</Text>
                    </View>
                    <View style={styles.controller}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập tên đăng nhập'
                                    leftIcon={
                                        <Icon
                                            name='person-circle'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.username ? errors.username.message : ''}
                                />
                            )}
                            name="username"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập mật khẩu'
                                    leftIcon={
                                        <Icon
                                            name='lock-closed'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.password ? errors.password.message : ''}
                                />
                            )}
                            name="password"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập lại mật khẩu'
                                    leftIcon={
                                        <Icon
                                            name='lock-closed'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.rePassword ? errors.rePassword.message : ''}
                                />
                            )}
                            name="rePassword"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập tên nhân viên'
                                    leftIcon={
                                        <Icon
                                            name='information-circle'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name ? errors.name.message : ''}
                                />
                            )}
                            name="name"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập số điện thoại nhân viên'
                                    leftIcon={
                                        <Icon
                                            name='call'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.phone ? errors.phone.message : ''}
                                />
                            )}
                            name="phone"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập email nhân viên'
                                    leftIcon={
                                        <Icon
                                            name='mail'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.email ? errors.email.message : ''}
                                />
                            )}
                            name="email"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập số nhà, tên đường'
                                    leftIcon={
                                        <Icon
                                            name='home'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.address ? errors.address.message : ''}
                                />
                            )}
                            name="address"
                            defaultValue=""
                        />

                    </View>
                    <View style={{ width: '95%', flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', paddingLeft: 5 }}>
                            <TakePhoto handleGetImg={handleGetImg} width={100} height={100} />
                        </View>
                    </View>

                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        title="Tiếp Theo"
                        buttonStyle={styles.button}
                        onPress={handleSubmit(onSubmit)}
                    />
                    <View
                        style={
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                            }
                        }
                    >
                        <Text>Đã có tài khoản?</Text>
                        <Button
                            title='Đăng nhập'
                            type="clear"
                            onPress={() => navigation.navigate('Login')}
                        />
                    </View>
                </View>
            </ScrollView>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    controller: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
    },
    logo: {
        width: 250,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#3F72AF',
        textTransform: "uppercase",
        paddingBottom: 20,
    },
    input: {
        height: 18,
    },
    select: {
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3F72AF',
        borderRadius: 4,
        color: '#3F72AF',
        paddingRight: 30,
    },
    button: {
        backgroundColor: '#3F72AF',
        color: 'black',
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40,
        marginTop: 15,
    }
});