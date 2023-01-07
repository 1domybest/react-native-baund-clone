import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, NativeModules, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@rneui/themed';
import { grey400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import * as yup from 'yup'
import { Formik } from 'formik'
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {ROUTES} from '../../../constants/routes'
const EmailAuthValidationScreen = (props) => {
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
      initialValues={{ emailAuthCode: '' }}
      validateOnMount={true}
      onSubmit={ values => {
        if (props.route.params.emailAuthCode === values.emailAuthCode) {
           Alert.alert('인증되었습니다.', '인증되었습니다'[
            {
              text: '확인',
              onPress: () => console.log('확인')
            }
          ])
          navigation.replace(ROUTES.REGISTERPASSWORD, {email: props.route.params.email})
        } else {
          Alert.alert('인증번호가 일치하지 않습니다.',[
            {
              text: '확인'
            },
          ])
        }
      }}
      validationSchema={emailValidationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
        <>
          <View style={styles.container}>
            <View >
              <Text style={styles.title}>인증번호를 입력해주세요.</Text>
            </View>
            <View style={isBirthFocused ? styles.inActiveInputBox : styles.activeInputBox}>
              <TextInput
                onFocus={() => setIsBirthFocused(true)}
                onBlur={() => {
                  setIsBirthFocused(false)
                  handleBlur('birthDay');
                }}
                placeholder="인증번호"
                keyboardType="number-pad"
                placeholderTextColor='#C5C8CE'
                onChangeText={handleChange('emailAuthCode')}
                value={values.emailAuthCode}
                autoFocus={true}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>
                {errors.emailAuthCode}
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1, position: 'absolute', bottom: 80, width: '100%',alignSelf: 'center' }}
              behavior={"padding"}
              keyboardVerticalOffset={statusBarHeight + 100}
            >
              <Button mode="contained" style={isValid ? styles.activeButton : styles.inActiveButton} onPress={() => handleSubmit()} disabled={!isValid}>
                <Text style={{ color: 'white', fontWeight: 'bold'}}>
                  인증하기
                </Text>
              </Button>
            </KeyboardAvoidingView>
          </View>
        </>
      )}
    </Formik>
  )
}


const emailValidationSchema = yup.object().shape({
  emailAuthCode: yup.string().required("인증번호를 입력해주세요.").length(5, ({ length }) => "인증번호 "+ length + "자리를 입력해주세요.")
})

export default EmailAuthValidationScreen

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
}));