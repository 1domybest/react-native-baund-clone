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
import {ROUTES} from '../../constants/routes'
import * as $Util from '../../constants/utils'
const LoginScreen = (props) => {
    const { navigation } = props;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = useStyles(props, windowWidth, windowHeight);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [shown, setShown] = useState(false);
    const [isPwFocused, setIsPwFocused] = useState(false);
    const { StatusBarManager } = NativeModules
    const [checked, setChecked] = useState(false);
    const [savedEmail, setSavedEmail] = useState("");

    useEffect(() => {
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
    }, []);

    $Util.getStoreData('savedEmail').then(async function (res) {
        if ($Util.isEmpty(res)) {
            $Util.setStoreData('savedEmail', {email : ""});
        } else {
            await setSavedEmail(res.email)
            setChecked(true)
        }
    })

    
    if ($Util.getStoreData('savedEmail').email !== undefined) {
        setChecked(true)
        setSavedEmail(JSON.parse($Util.getStoreData("savedEmail")).email)
    }
    
    function toggleShown() {
        setShown(!shown)
    }
    

    const [statusBarHeight, setStatusBarHeight] = useState(0);

    
    return (
        <Formik
            initialValues={{ email: savedEmail, password: '' }}
            validateOnMount={true}
            onSubmit={async values => {
                if (checked) {
                    await $Util.setStoreData('savedEmail', {email : values.email});
                } else {
                    await $Util.setStoreData('savedEmail', {email : ""});
                }
            }}
            validationSchema={loginValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
                <>
                    <View style={styles.container}>
                        <View style={styles.box}>
                            <>
                                <View style={isEmailFocused ? styles.activeIdInput : styles.inActiveIdInput}>
                                    <TextInput
                                        onFocus={() => setIsEmailFocused(true)}
                                        onBlur={() => {
                                            setIsEmailFocused(false)
                                            handleBlur('email');
                                        }}
                                        placeholder="이메일"
                                        keyboardType="email-address"
                                        placeholderTextColor='#C5C8CE'
                                        onChangeText={handleChange('email')}
                                        value={values.email}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: 'red' }}>{values.email.length > 0 ? errors.email : ''}</Text>
                                </View>
                            </>
                            <>
                                <View style={isPwFocused ? styles.activePwInput : styles.inActivePwInput}>
                                    <TextInput
                                        style={{ width: '90%' }}
                                        onFocus={() => setIsPwFocused(true)}
                                        onBlur={() => {
                                            handleBlur('password');
                                            setIsPwFocused(false);
                                        }}
                                        placeholder="비밀번호"
                                        secureTextEntry={!shown ? true : false}
                                        placeholderTextColor='#C5C8CE'
                                        onChangeText={handleChange('password')}
                                        value={values.password}
                                    />
                                    <TouchableOpacity style={styles.icon} onPress={() => toggleShown()}>
                                        <Ionicons onPress={() => toggleShown()} name={shown ? 'eye' : 'eye-off'} size={28} color={isPwFocused ? 'red' : 'black'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: 'red' }}>{values.password.length > 0 ? errors.password : ''}</Text>
                                </View>
                            </>
                        </View>
                        <KeyboardAvoidingView
                            style={{ flex: 1, position: 'absolute', bottom: 100, width: '100%' }}
                            behavior={"padding"}
                            keyboardVerticalOffset={statusBarHeight + 100}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        color="white"
                                        center
                                        containerStyle={{ backgroundColor: 'transparent' }}
                                        textStyle={checked ? { color: 'black', fontWeight: 'bold' } : {}}
                                        title="로그인 정보 저장"
                                        checked={checked}
                                        checkedColor="red"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        onPress={() => {
                                            setChecked(!checked)
                                        }}
                                    />
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => navigation.push(ROUTES.REGISTEREMAILAUTH, {type: 'findPassword'})}>
                                        <Text style={{ fontSize: 13 }}>비밀번호를 잊으셨나요?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Button mode="contained" style={isValid ? styles.activeLoginButton : styles.inActiveLoginButton} onPress={() => handleSubmit()} disabled={!isValid}>
                                    <Text style={{ color: 'white' }}>
                                        로그인
                                    </Text>
                                </Button>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                                <Text style={{ marginRight: 10 }}>회원이 아니신가요?</Text>
                                <Text style={styles.joinText}>회원가입</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </>
            )}</Formik>
    )
}

const loginValidationSchema = yup.object().shape({
    email: yup.string().required("이메일을 입력해주세요").email("올바른 이메일을 작성해주세요"),
    password: yup.string().required("비밀번호를 입력해주세요")
    .min(8, ({ min }) => "비밀번호는 최소 " + min + " 자리 이상입니다.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, '영문 대소문자,숫자 특수문자 포함 8-20자이내')
})

export default LoginScreen

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
    activeLoginButton: {
        marginTop: 10,
        backgroundColor: theme.colors.grey4,
        borderRadius: 10,
    },
    inActiveLoginButton: {
        marginTop: 10,
        backgroundColor: theme.colors.grey1,
        borderRadius: 10,
    },
    joinText: {
        color: theme.colors.error
    }
}));