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
const RegisterNickNameScreen = (props) => {
    const { navigation } = props;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = useStyles(props, windowWidth, windowHeight);
    const [isNickNameFocused, setisNickNameFocused] = useState(false);
    const { StatusBarManager } = NativeModules
    const [checked, setChecked] = React.useState(false);


    useEffect(() => {
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
    }, []);


    const [statusBarHeight, setStatusBarHeight] = useState(0);

    return (
        <Formik
            initialValues={{ nickName: ''}}
            validateOnMount={true}
            onSubmit={values => {
                navigation.navigate(ROUTES.REGISTERUSERNAME, {email: props.route.params.email, password: props.route.params.password, nickName: values.nickName})
            }}
            validationSchema={loginValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
                <>
                    <View style={styles.container}>
                        <View style={styles.box}>
                            <>
                                <View style={{marginBottom: 60}}>
                                    <Text style={styles.title}>사용자이름을 입력해주세요.</Text>
                                </View>
                                <View style={isNickNameFocused ? styles.activeInput : styles.inActiveInput}>
                                    <Text style={{color: '#C5C8CE', alignSelf: 'center', marginRight: 10,}}>
                                        baund.com /
                                    </Text>
                                    <TextInput
                                        style={{}}
                                        onFocus={() => setisNickNameFocused(true)}
                                        onBlur={() => {
                                            handleBlur('nickName');
                                            setisNickNameFocused(false);
                                        }}
                                        placeholder="사용자이름"
                                        placeholderTextColor='#C5C8CE'
                                        onChangeText={handleChange('nickName')}
                                        value={values.password}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    {
                                        values.nickName.length === 0 ? (
                                            <View>
                                                <Text style={{color: '#C5C8CE'}}>4-20 자</Text>
                                                <Text style={{color: '#C5C8CE'}}>(영문 소문자,숫자, 밑줄 및 마침표만 포함 가능)</Text>
                                            </View>
                                        )
                                        : 
                                        <Text style={{ color: 'red' }}>{errors.nickName}</Text>
                                    }
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
    nickName: yup.string().required("사용자이름을 입력해주세요")
        .matches(/^[_a-z0-9+]{4,20}$/, '사용자이름 형식이 맞지 않습니다. 4-20자 (영문 소문자, 숫자, 밑줄 및 마침표만 포함 가능)')
})

export default RegisterNickNameScreen

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
    activeInput: {
        paddingHorizontal: 10,
        color: theme.colors.black,
        padding: 10,
        borderBottomColor: theme.colors.error,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 5,
        flexDirection: 'row'
    },
    inActiveInput: {
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