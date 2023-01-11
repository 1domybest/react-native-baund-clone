import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, NativeModules } from 'react-native'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@rneui/themed';
import { grey400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import * as yup from 'yup'
import { Formik } from 'formik'
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {sendEmailAuthCodeRequest, temporaryPasswordRequest, emailDoubleCheckRequest} from '../../../actions/userAction'
import userSlicer from '../../../slicers/userSlicer'
const RegisterEmailAuthScreen = (props) => {
  const { navigation } = props;
  const styles = useStyles(props);
  const [isBirthFocused, setIsBirthFocused] = useState(false);
  const { StatusBarManager } = NativeModules
  const dispatch = useDispatch();

  useEffect(() => {
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
        setStatusBarHeight(statusBarFrameData.height)
    }) : null
}, []);

const [statusBarHeight, setStatusBarHeight] = useState(0);

  return (
    <Formik
      initialValues={{ email: '' }}
      validateOnMount={true}
      onSubmit={values => {
        if (props.route.params.type === 'findPassword') {
          let params = {navigation: navigation,email: values.email};
          dispatch(temporaryPasswordRequest(params));
        } else {
          let params = {navigation: navigation,email: values.email};
          dispatch(emailDoubleCheckRequest(params));
        }
      }}
      validationSchema={emailValidationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
        <>
          <View style={styles.container}>
            <View >
              <Text style={styles.title}>이메일 주소를 입력해주세요.</Text>
            </View>
            <View style={isBirthFocused ? styles.inActiveInputBox : styles.activeInputBox}>
              <TextInput
                onFocus={() => setIsBirthFocused(true)}
                onBlur={() => {
                  setIsBirthFocused(false)
                  handleBlur('birthDay');
                }}
                placeholder="이메일 주소"
                keyboardType="email-address"
                placeholderTextColor='#C5C8CE'
                onChangeText={handleChange('email')}
                value={values.email}
                autoFocus={true}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>
                {errors.email}
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1, position: 'absolute', bottom: 80, width: '100%',alignSelf: 'center' }}
              behavior={"padding"}
              keyboardVerticalOffset={statusBarHeight + 100}
            >
              {
                props.route.params.type=== 'findPassword' ?
                <Button mode="contained" style={isValid ? styles.activeLoginButton : styles.inActiveLoginButton} onPress={() => handleSubmit()} disabled={!isValid}>
                <Text style={{ color: 'white', fontWeight: 'bold'}}>
                  임시 비밀번호 발급
                </Text>
              </Button>
              :
              <Button mode="contained" style={isValid ? styles.activeLoginButton : styles.inActiveLoginButton} onPress={() => handleSubmit()} disabled={!isValid}>
                <Text style={{ color: 'white', fontWeight: 'bold'}}>
                  인증번호 발송
                </Text>
              </Button>
              }
              
            </KeyboardAvoidingView>
          </View>
        </>
      )}
    </Formik>
  )
}


const emailValidationSchema = yup.object().shape({
  email: yup.string().required("이메일을 입력해주세요.").email('이메일 형식이 맞지 않습니다.')
})

export default RegisterEmailAuthScreen

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  subTitle: {
    color: theme.colors.grey2
  },
  activeInputBox: {
    padding: 10,
    marginTop: 50,
    borderBottomWidth: 1,
    borderColor: theme.colors.grey3
  },
  inActiveInputBox: {
    padding: 10,
    marginTop: 50,
    borderBottomWidth: 1,
    borderColor: theme.colors.error
  },
  activeLoginButton: {
    marginTop: 10, 
    backgroundColor: theme.colors.grey1,
    width: '100%',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center'
},
 inActiveLoginButton: {
    marginTop: 10, 
    width: '100%',
    backgroundColor: theme.colors.grey4,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center'
},
}));