import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, NativeModules } from 'react-native'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@rneui/themed';
import { grey400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import * as yup from 'yup'
import { Formik } from 'formik'
import { Button } from 'react-native-paper';
import {ROUTES} from '../../../constants/routes'
const RegisterBirthDayScreen = (props) => {
  const { navigation } = props;
  const styles = useStyles(props);
  const [isBirthFocused, setIsBirthFocused] = useState(false);
  const { StatusBarManager } = NativeModules
  useEffect(() => {
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
        setStatusBarHeight(statusBarFrameData.height)
    }) : null
}, []);

const [statusBarHeight, setStatusBarHeight] = useState(0);

  return (
    <Formik
      initialValues={{ birthDay: '' }}
      validateOnMount={true}
      onSubmit={values => {
        navigation.navigate(ROUTES.REGISTEREMAILAUTH, {type: 'register'})
      }}
      validationSchema={birthDayValidationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
        <>
          <View style={styles.container}>
            <View >
              <Text style={styles.title}>생년월일을 입력해주세요.</Text>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.subTitle}>수집된 생년월일은 만 14세 이상임을</Text>
                <Text style={styles.subTitle}>확인하려는 용도로 사용되며, 확인 즉시 폐기됩니다.</Text>
              </View>
            </View>
            <View style={isBirthFocused ? styles.inActiveInputBox : styles.activeInputBox}>
              <TextInput
                onFocus={() => setIsBirthFocused(true)}
                onBlur={() => {
                  setIsBirthFocused(false)
                  handleBlur('birthDay');
                }}
                placeholder="예시) YYYYMMDD"
                keyboardType="numeric"
                placeholderTextColor='#C5C8CE'
                onChangeText={handleChange('birthDay')}
                value={values.birthDay}
                autoFocus={true}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>
                {errors.birthDay}
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1, position: 'absolute', bottom: 80, width: '100%',alignSelf: 'center' }}
              behavior={"padding"}
              keyboardVerticalOffset={statusBarHeight + 100}
            >
              <Button mode="contained" style={isValid ? styles.activeLoginButton : styles.inActiveLoginButton} onPress={() => handleSubmit()} disabled={!isValid}>
                <Text style={{ color: 'white', fontWeight: 'bold'}}>
                  다음
                </Text>
              </Button>
            </KeyboardAvoidingView>
          </View>
        </>
      )}
    </Formik>
  )
}


const birthDayValidationSchema = yup.object().shape({
  birthDay: yup.string().required("생년월일을 작성해주세요.").matches(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/, '생년월일 형식이 맞지 않습니다.')
})

export default RegisterBirthDayScreen

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
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: theme.colors.grey3
  },
  inActiveInputBox: {
    padding: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: theme.colors.error
  },
  activeLoginButton: {
    marginTop: 10, 
    backgroundColor: theme.colors.grey4,
    width: '100%',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center'
},
 inActiveLoginButton: {
    marginTop: 10, 
    width: '100%',
    backgroundColor: theme.colors.grey1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center'
},
}));