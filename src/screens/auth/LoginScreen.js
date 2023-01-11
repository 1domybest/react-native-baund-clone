import { Text, TextInput, View, KeyboardAvoidingView, NativeModules, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'

import { makeStyles } from '@rneui/themed';
import { Button } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ROUTES } from '../../constants/routes'
import * as $Util from '../../constants/utils'
import { useDispatch, useSelector } from 'react-redux';
import {loginRequset} from '../../actions/userAction'
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValid, setEmailValid] = useState(null);
    const [passwordValid, setPasswordlValid] = useState(null);
    const dispath = useDispatch();

    useEffect(() => {
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
        $Util.getStoreData('savedEmail').then(async function (res) {
            if ($Util.isEmpty(res.email)) {
                $Util.setStoreData('savedEmail', { email: "" });
            } else {
                setEmail(res.email)
                setEmailValid(true)
                setChecked(true)
            }
        })
    }, []);


    if ($Util.getStoreData('savedEmail').email !== undefined) {
        setChecked(true)
        setEmail($Util.getStoreData("savedEmail").email)
    }

    function toggleShown() {
        setShown(!shown)
    }


    const login = async () => {
        if (checked) {
            await $Util.setStoreData('savedEmail', {email : email});
        } else {
            await $Util.setStoreData('savedEmail', {email : ""});
        }

        if (!emailValid) {
            Alert.alert(
                '이메일을 확인해주세요.'
            )
            return false
        }

        if (!passwordValid) {
            Alert.alert(
                '비밀번호를 확인해주세요..'
            )
            return false
        }

        let params = {
            email: email,
            password: password
        }
        dispath(loginRequset(params))

    }

    const changeEmail = (email) => {
        let emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        let emailValid = emailRegExp.test(email);
        setEmail(email);
        setEmailValid(emailValid)
    }

    const changePassword = (password) => {
        let passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        let passwordValid = passwordRegExp.test(password);
        setPassword(password)
        setPasswordlValid(passwordValid)
    }

    const [statusBarHeight, setStatusBarHeight] = useState(0);


    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <>
                    <View style={isEmailFocused ? styles.activeIdInput : styles.inActiveIdInput}>
                        <TextInput
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => {setIsEmailFocused(false)}}
                            placeholder="이메일"
                            keyboardType="email-address"
                            placeholderTextColor='#C5C8CE'
                            onChangeText={(email) => changeEmail(email)}
                            value={email}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'red' }}>{emailValid != null && email.length === 0 ? '이메일을 입력해주세요' : emailValid  === false? '정확한 이메일을 입력해주세요': ''}</Text>
                    </View>
                </>
                <>
                    <View style={isPwFocused ? styles.activePwInput : styles.inActivePwInput}>
                        <TextInput
                            style={{ width: '90%' }}
                            onFocus={() => setIsPwFocused(true)}
                            onBlur={() => {setIsPwFocused(false);}}
                            placeholder="비밀번호"
                            secureTextEntry={!shown ? true : false}
                            placeholderTextColor='#C5C8CE'
                            onChangeText={(password) => changePassword(password)}
                            value={password}
                        />
                        <TouchableOpacity style={styles.icon} onPress={() => toggleShown()}>
                            <Ionicons onPress={() => toggleShown()} name={shown ? 'eye' : 'eye-off'} size={28} color={isPwFocused ? 'red' : 'black'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                    <Text style={{ color: 'red' }}>{passwordValid != null && password.length === 0 ? '비밀번호룰 입력해주세요' : passwordValid === false ? '영문 대소문자,숫자 특수문자 포함 8-20자이내': ''}</Text>
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
                            onPress={() => {setChecked(!checked)}}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => navigation.push(ROUTES.REGISTEREMAILAUTH, { type: 'findPassword' })}>
                            <Text style={{ fontSize: 13 }}>비밀번호를 잊으셨나요?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Button mode="contained" style={emailValid && passwordValid ? styles.activeLoginButton : styles.inActiveLoginButton} onPress={() => {login()}} disabled={!emailValid || !passwordValid}>
                        <Text style={{ color: 'white' }}>
                            로그인
                        </Text>
                    </Button>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    <Text style={{ marginRight: 10 }}>회원이 아니신가요?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                        <Text style={styles.joinText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

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
        backgroundColor: theme.colors.grey1,
        borderRadius: 10,
    },
    inActiveLoginButton: {
        marginTop: 10,
        backgroundColor: theme.colors.grey4,
        borderRadius: 10,
    },
    joinText: {
        color: theme.colors.error
    }
}));