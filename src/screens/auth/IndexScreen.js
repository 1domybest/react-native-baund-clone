import { StyleSheet, Text, View, Image , Dimensions, useColorScheme } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Avatar, useThemeMode } from '@rneui/themed';
import {ROUTES} from '../../constants/routes'
const IndexScreen = (props) => {
    const {navigation} = props
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { mode, setMode } = useThemeMode();
    nowMode = useColorScheme();
    useEffect(() => {
        setMode(nowMode)
      },[]);

    const [isSigned, setIsSigned] = useState();
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
                    <View style={{marginTop: 20, width: '95%', justifyContent: 'space-around', flexDirection: 'row'}}>
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
                    <TouchableOpacity>
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