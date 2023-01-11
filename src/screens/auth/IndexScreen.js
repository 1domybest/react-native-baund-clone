import { StyleSheet, Text, View, Image , Dimensions, useColorScheme } from 'react-native'
import React, {useEffect, useState, useLayoutEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Avatar, useThemeMode } from '@rneui/themed';
import {ROUTES} from '../../constants/routes'
import {snsLoginRequset} from '../../actions/userAction'
import { useDispatch, useSelector } from 'react-redux';
import * as $Util from '../../constants/utils'
import {   
    GoogleSignin,
    statusCodes,
  } from '@react-native-google-signin/google-signin'; 

const IndexScreen = (props) => {
    const {navigation} = props
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const dispatch = useDispatch();
    
    const { mode, setMode } = useThemeMode();

  
    useLayoutEffect(() => {
        // --------- 여기부터 -------------
        const isLogined = async () => { // <-- async 추가
            let token = await $Util.getStoreData('token');
            if (!$Util.isEmpty(token)) {
                console.log(token)
                if (!$Util.isEmpty(token.accessToken)) {
                    navigation.replace(ROUTES.MAIN);
                } else {
                    console.log('로그인한적 X')    
                }
            } else {
                await $Util.setStoreData('token', {accessToken: null, refreshToken: null})
            }
        }
        isLogined(); // <----- 여기에서 만든함수를 한번만 호출
        // --------- 여기까지를 원함 -------------
      }, []);  

    nowMode = useColorScheme();
    useEffect(() => { 
        setMode(nowMode)
      },[]);

    const [isSigned, setIsSigned] = useState();

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: Platform.OS === 'ios' ? '227092955567-htg4giscens7ek3e0fm53s376nrqgn88.apps.googleusercontent.com' : '227092955567-masfk09hr42qgi4bgthig8qirj7cm9q1.apps.googleusercontent.com'
      }); 

    const googleLogin = async () => { 
        console.log('구글 로그인 시작');
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          let params = {};
          params['userName'] = userInfo.user.name;
          params['email'] = userInfo.user.email;
          params['provider'] = 'google';
          params['providerId'] = userInfo.user.id;
          
          dispatch(snsLoginRequset(params));
    
        } catch (error) {
          console.log(error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
        <Image source={require('../../assets/mainLogo.png')} style={{width: windowWidth, height: windowHeight, position: 'absolute'}}/>
        <SafeAreaView style={{position: 'relative', marginHorizontal: 25, flex: 1}}>
            <View style={{position: 'absolute', top: windowHeight/5}}>
                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold' }}>
                    {isSigned ? '이미 가입하셨나요?' : '회원이 아니신가요?'}
                </Text>
                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', marginTop: 3}}>
                    {isSigned ? '로그인하세요' : '지금 가입하세요'}
                </Text>
            </View>
            <View style={{position: 'absolute', bottom: 60, width: '100%'}}>
                { 
                    isSigned ?
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                    <View style={{borderWidth: 1, borderColor: 'white', borderRadius: 9, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>이메일로 로그인</Text>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                    <View style={{borderWidth: 1, borderColor: 'white', borderRadius: 9, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>이메일로 가입</Text>
                    </View>
                </TouchableOpacity>
                }
                    <View style={{marginTop: 25, width: '95%', alignSelf: 'center'}}>
                        <Divider width={2}/>
                    </View>
                    <View style={{marginTop: 20, width: '95%', justifyContent: 'space-evenly', flexDirection: 'row'}}>
                    <TouchableOpacity>
                    <Avatar
                        size={40}
                        rounded
                        source={require('../../assets/appleIcon.png')}
                        containerStyle={{backgroundColor: 'grey'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Avatar
                        size={40}
                        rounded
                        source={require('../../assets/kakaoIcon.png')}
                        containerStyle={{backgroundColor: 'yellow'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Avatar
                        size={40}
                        rounded
                        source={require('../../assets/facebookIcon.png')}
                        containerStyle={{backgroundColor: '#496cb5'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => googleLogin()}>
                    <Avatar
                        size={40}
                        rounded
                        source={require('../../assets/googleIcon.png')}
                        containerStyle={{backgroundColor: 'white'}}
                        />
                    </TouchableOpacity>                        
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'center'}}>
                        <View style={{flexDirection: 'row', marginTop: 50}}>
                            <Text style={{fontWeight: '500',color: 'grey', marginRight: 10}}>
                                {
                                    isSigned ?
                                    '회원이 아니신가요?'
                                    :
                                    '이미 가입하셨나요?'
                                }
                            </Text>
                            {
                                isSigned ?
                                <TouchableOpacity onPress={() => setIsSigned(!isSigned)}>
                                    <Text style={{fontWeight: 'bold',color: 'red'}}>회원가입</Text>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity onPress={() => setIsSigned(!isSigned)}>
                                    <Text style={{fontWeight: 'bold',color: 'red'}}>로그인</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
            </View>
        </SafeAreaView>
    </View>
  )
}

export default IndexScreen

const styles = StyleSheet.create({})