import {createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import {Alert} from 'react-native'
import * as $Util from '../constants/utils'
import {ROUTES} from '../constants/routes'
const sendEmailAuthCode = async () => {
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/sendEmailAuthCode', {to: 'dhstjrxo123@gmail.com'}, {withCredentials: true})
        .then(async function(res) {
            resolve(res.data);
        }).catch ((error) => {
            alert(error.response.data.message);
            reject (error.response.data) ;
        })
    })
}

const temporaryPassword = async () => {
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/temporaryPassword', {to: 'dhstjrxo123@gmail.com'}, {withCredentials: true})
        .then(async function(res) {
            resolve(res.data.data.emailAuthCode);
        }).catch ((error) => {
            alert(error.response.data.message);
            reject (error.response.data) ;
        })
    })
}

const snsLogin = async (params) => {
    console.log('로그인 요청 파마미터')
    console.log(params)
    return new Promise (function (resolve, reject) {
     axios.post('http://localhost:8080/api/common/user/snsLogin', params, {withCredentials: true})
        .then(async function(res) {
            if (res.data.code === 200) { // 정상 코드가 들어올시 비지니스로직 진행
                let result =  {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                    loading: false,
                }
                $Util.setStoreData('token', {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                });

                Alert.alert(
                    res.data.message,
                    '로그인',
                    [
                        {text: '확인'}
                    ]
                )
                resolve(result);
            }
        }).catch(error => {
            if (error.response.data.code !== 303) { // 일반회원이 아니면
                alert(error.response.data.message);
                reject (error.response.data) ;
            } else {
                Alert.alert(
                    error.response.data.message,
                    'sns 로그인 연동하기',
                    [
                        {
                            text: '연동하기',
                            onPress: async () => await updateProvider(params)
                        },
                        {
                            text: '취소',
                            onPress: () => {reject (error.response.data);},
                            style: "cancel"
                        },
                    ],
                    { cancelable: false }
                )
            }
            
        })
    })
}

const updateProvider = async (params) => {
    await axios.post('http://localhost:8080/api/common/user/updateProvider', params, {withCredentials: true})
    .then(function(res) {
        if (res.data.code === 200) { // 정상 코드가 들어올시 비지니스로직 진행
            snsLogin(params)
        }
    }).catch(error => {
        alert(error.response.data.message);
    })
}

const logOutRequest = createAsyncThunk('userLogOut', async (navigation, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    // try catch 는 하지말아야 에러를 캐치할수 있다.
    // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
    //const state = getState(); // 상태가져오기
    let data = {
        accessToken: null,
        refreshToken: null,
    }
    await $Util.setStoreData("token", data)
    return data;
})

const snsLoginRequset = createAsyncThunk('userLogIn', async (data, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    // try catch 는 하지말아야 에러를 캐치할수 있다.
    // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
    //const state = getState(); // 상태가져오기

    let result = await snsLogin(data);

    return result;
})

const temporaryPasswordRequest = createAsyncThunk('userLogIn', async (data, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    temporaryPassword().then(function(res) {
    
        if (res.code === 200) {
            Alert.alert(
                res.data.message,
                '인증',
                [
                    {text: '확인', onPress: () => data.navigation.navigate(ROUTES.INDEX)}
                ]
            )
        }
    })
})


const sendEmailAuthCodeRequest = createAsyncThunk('userLogIn', async (data, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    sendEmailAuthCode().then(function(res) {
        console.log(res)
        if (res.code === 200) {
            Alert.alert(
                res.message,
                '인증',
                [
                    {text: '확인', onPress: () => data.navigation.navigate(ROUTES.REGISTEREMAILAUTHVALIDATION, {emailAuthCode: res.data.emailAuthCode, emaiil: data.email})}
                ]
            )
        }
    })
})


export {snsLoginRequset, logOutRequest, sendEmailAuthCodeRequest, temporaryPasswordRequest}