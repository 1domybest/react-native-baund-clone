import { Text, TextInput, View, KeyboardAvoidingView, NativeModules } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import { Dimensions } from 'react-native'
import { makeStyles } from '@rneui/themed';
import { Button } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ROUTES } from '../../../constants/routes'
const RegisterPasswordScreen = (props) => {
    const { navigation } = props;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = useStyles(props, windowWidth, windowHeight);
    const [passwordShown, setPasswordShown] = useState(false);
    const [rePasswordShown, setRePasswordShown] = useState(false);
    const [isPwFocused, setIsPwFocused] = useState(false);
    const [isRePwFocused, setIsRePwFocused] = useState(false);
    const { StatusBarManager } = NativeModules
    const [checked, setChecked] = React.useState(false);


    useEffect(() => {
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
    }, []);

    console.log(props.route.params)

    function toggleShown(type) {
        if (type === 'password') {
            setPasswordShown(!passwordShown)
        } else {
            setRePasswordShown(!rePasswordShown)
        }
    }

    const [statusBarHeight, setStatusBarHeight] = useState(0);

    return (
        <Formik
            initialValues={{ password: '', rePassword: '' }}
            validateOnMount={true}
            onSubmit={values => {
                navigation.navigate(ROUTES.REGISTERNICKNAME, {email: props.route.params.email, password: values.password})
            }}
            validationSchema={loginValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
                <>
                    <View style={styles.container}>
                        <View style={styles.box}>
                            <>
                                <View >
                                    <Text style={styles.title}>비밀번호를 입력해주세요.</Text>
                                </View>
                                <View style={isPwFocused ? styles.activePwInput : styles.inActivePwInput}>
                                    <TextInput
                                        style={{ width: '90%' }}
                                        onFocus={() => setIsPwFocused(true)}
                                        onBlur={() => {
                                            handleBlur('password');
                                            setIsPwFocused(false);
                                        }}
                                        placeholder="비밀번호 입력"
                                        secureTextEntry={!passwordShown ? true : false}
                                        placeholderTextColor='#C5C8CE'
                                        onChangeText={handleChange('password')}
                                        value={values.password}
                                    />
                                    <TouchableOpacity style={styles.icon} onPress={() => toggleShown('password')}>
                                        <Ionicons onPress={() => toggleShown('password')} name={passwordShown ? 'eye' : 'eye-off'} size={28} color={isPwFocused ? 'red' : 'black'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: 'red' }}>{values.password.length > 0 ? errors.password : ''}</Text>
                                </View>
                            </>
                            <>
                                <View style={isRePwFocused ? styles.activePwInput : styles.inActivePwInput}>
                                    <TextInput
                                        style={{ width: '90%' }}
                                        onFocus={() => setIsRePwFocused(true)}
                                        onBlur={() => {
                                            handleBlur('rePassword');
                                            setIsRePwFocused(false);
                                        }}
                                        placeholder="비밀번호 확인"
                                        secureTextEntry={!rePasswordShown ? true : false}
                                        placeholderTextColor='#C5C8CE'
                                        onChangeText={handleChange('rePassword')}
                                        value={values.rePassword}
                                    />
                                    <TouchableOpacity style={styles.icon} onPress={() => toggleShown('rePassword')}>
                                        <Ionicons onPress={() => toggleShown('rePassword')} name={rePasswordShown ? 'eye' : 'eye-off'} size={28} color={isRePwFocused ? 'red' : 'black'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: 'red' }}>{values.rePassword.length > 0 ? errors.rePassword : ''}</Text>
                                </View>
                            </>
                        </View>
                        <KeyboardAvoidingView
                            style={{ flex: 1, position: 'absolute', bottom: 100, width: '100%' }}
                            behavior={"padding"}
                            keyboardVerticalOffset={statusBarHeight + 70}
                        >
                            <View>
                                <Button mode="contained" style={isValid ? styles.activeButton : styles.inActiveButton} onPress={() => handleSubmit()} disabled={!isValid}>
                                    <Text style={{ color: 'white' }}>
                                        다음
                                    </Text>
                                </Button>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </>
            )}</Formik>
    )
}

const loginValidationSchema = yup.object().shape({
    password: yup.string().required("비밀번호를 입력해주세요")
        .min(8, ({ min }) => "비밀번호는 최소 " + min + " 자리 이상입니다.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, '영문 대소문자,숫자 특수문자 포함 8-20자이내'),
    rePassword: yup.string().oneOf([yup.ref('password'), null],
    '비밀번호가 일치하지 않습니다.')
})

export default RegisterPasswordScreen

const useStyles = makeStyles((theme, props) => ({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: 'center',
        alignItems: "center",
        width: '100%',
        paddingHorizontal: 20,
        height: props.windowHeight,
        position: 'relative',
        backgroundColor: theme.colors.white
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 30,
      },
      subTitle: {
        color: theme.colors.grey2
      },
    box: {
        marginTop: 20,
    },
    inActiveIdInput: {
        paddingHorizontal: 10,
        color: theme.colors.black,
        padding: 10,
        borderBottomColor: theme.colors.grey4,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 5
    },
    activeIdInput: {
        paddingHorizontal: 10,
        color: theme.colors.black,
        padding: 10,
        borderBottomColor: theme.colors.error,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 5
    },
    inActivePwInput: {
        flexDirection: 'row',
        marginTop: 20,
        paddingHorizontal: 10,
        color: theme.colors.black,
        borderBottomColor: theme.colors.grey4,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 5,
    },
    activePwInput: {
        flexDirection: 'row',
        marginTop: 20,
        paddingHorizontal: 10,
        color: theme.colors.black,
        borderBottomColor: theme.colors.error,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 5,
    },
    pwInput: {

    },
    icon: {

    },
    activeButton: {
        marginTop: 10, 
        backgroundColor: theme.colors.grey4,
        width: '100%',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
     inActiveButton: {
        marginTop: 10, 
        width: '100%',
        backgroundColor: theme.colors.grey1,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
    joinText: {
        color: theme.colors.error
    }
}));