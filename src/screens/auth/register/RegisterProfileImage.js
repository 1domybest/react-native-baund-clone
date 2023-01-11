import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import { makeStyles } from '@rneui/themed';
import { ROUTES } from '../../../constants/routes'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Avatar } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AWSS3 from '../../../constants/awsS3'
import fs from 'react-native-fs'
import {base64, decode} from 'base64-arraybuffer'
import { useDispatch, useSelector } from 'react-redux';
import {registerRequest} from '../../../actions/userAction'
const RegisterProfileImage = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const toggleCheckbox = () => setChecked(!checked);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = useStyles(props, windowWidth, windowHeight);
    const [checked, setChecked] = React.useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);



    const fileUpload = async (rawFile, type) => {
        const base64 = await fs.readFile(rawFile.uri, 'base64');
        const arrayBuffer = decode(base64);
        let file = {
            uri: arrayBuffer,
            type: rawFile.type,
            name: rawFile.fileName
        }
        let result = await AWSS3.uploadFile(file, type);
        return result;
    }
    

    const beforeUploadBackgroundImage = () => {
        launchImageLibrary({}, function (res) {
            if (res.assets) {
                setBackgroundImage(res.assets[0])
            }
        })
    }

    const beforeUploadProfileImage = () => {
        launchImageLibrary({}, function (res) {
            if (res.assets) {
                setProfileImage(res.assets[0])   
            }
        })
    }

    const register = async () => {
        let profileImageFile = null;
        let backgrooundImageFile = null;
        if (profileImage != null) {
            await fileUpload(profileImage, 'profileImage').then(function(res) {
                profileImageFile = {
                    tag: res.ETag,
                    bucket: res.Bucket,
                    key: res.Key,
                    location: res.Location,
                    serverSideEncryption : res.ServerSideEncryption
                }
            })
        }
        if (backgroundImage != null) {
            await fileUpload(backgroundImage, 'backgroundImage').then(function (res) {
              backgrooundImageFile = {
                tag: res.ETag,
                bucket: res.Bucket,
                key: res.Key,
                location: res.Location,
                serverSideEncryption : res.ServerSideEncryption
            }
            })
        }

        let data = {
            userName: props.route.params.userName,
            nickName: props.route.params.nickName,
            password: props.route.params.password,
            email: props.route.params.email,
            profileImageFile: profileImageFile,
            backgroundImageFile: backgrooundImageFile,
        }

        let params = {
            data: data,
            navigation: navigation
        }

        dispatch(registerRequest(params));
    }


    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 5 }}>
                <Text style={styles.title}>프로필 이미지를 등록하세요.</Text>
            </View>
            <View style={{ backgroundColor: '#363535', position: 'relative' }}>
                <TouchableOpacity onPress={() => beforeUploadBackgroundImage()}>
                    {
                        backgroundImage === null ?
                        <Image source={require('../../../assets/baundProfileImage.png')} style={{ height: windowHeight / 2.2, width: windowWidth }} />
                        :
                        <Image source={{uri: backgroundImage.uri}} style={{ height: windowHeight / 2.2, width: windowWidth }} />
                    }
                    <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row' }}>
                        <Avatar.Icon size={35} icon="camera" color='white' style={{ backgroundColor: 'grey' }} />
                    </View> 
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 10, left: 10, flexDirection: 'row' }}>
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity  onPress={() => beforeUploadProfileImage()}>
                            {
                            profileImage === null ? 
                            <>
                            <Avatar.Icon size={65} icon="account" color='white' style={{ backgroundColor: 'lightgrey' }} />
                            <Avatar.Icon size={30} icon="camera" color='white' style={{ backgroundColor: '#363535', position: 'absolute', top: -5, right: -5 }} />
                            </>
                            :
                            <Avatar.Image size={65} source={{uri: profileImage.uri}} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: 'white', fontSize: 30 }}>{props.route.params.userName}</Text>
                        <Text style={{ color: 'white', fontSize: 18 }}>{props.route.params.nickName}</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignSelf: 'flex-start', paddingTop: 10, justifyContent: 'flex-start', alignContent: 'flex-start', alignItems: 'flex-start' }}>
                <CheckBox
                    color="white"
                    center
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                    textStyle={{ color: 'black', fontWeight: 'bold' }}
                    title="모두 동의하기"
                    checked={checked}
                    checkedColor="red"
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    onPress={() => {
                        setChecked(!checked)
                    }}
                />
                <CheckBox
                    color="white"
                    center
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                    textStyle={{ color: 'black', fontWeight: 'bold' }}
                    title="(필수) 서비스 이용 약관 동의"
                    checked={checked}
                    checkedColor="red"
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    onPress={() => {
                        setChecked(!checked)
                    }}
                />
                <CheckBox
                    color="white"
                    center
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                    textStyle={{ color: 'black', fontWeight: 'bold' }}
                    title="(필수) 개인정보 처리방침 동의"
                    checked={checked}
                    checkedColor="red"
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    onPress={() => {
                        setChecked(!checked)
                    }}
                />
                <CheckBox
                    color="white"
                    center
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                    textStyle={{ color: 'black', fontWeight: 'bold' }}
                    title="(선택) 마케팅 정보 수신 동의"
                    checked={checked}
                    checkedColor="red"
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    onPress={() => {
                        setChecked(!checked)
                    }}
                />
                <CheckBox
                    color="white"
                    center
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                    textStyle={{ color: 'black', fontWeight: 'bold' }}
                    title="(선택) (오후 9시부터 익일 오전 8시) 푸시 수신동의"
                    checked={checked}
                    checkedColor="red"
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    onPress={() => {
                        setChecked(!checked)
                    }}
                />
            </View>
            <View style={{ width: '100%' }}>
                <Button mode="contained" style={true ? styles.activeButton : styles.inActiveButton} disabled={false} onPress={() => register()}>
                    <Text style={{ color: 'white' }}>
                        다음
                    </Text>
                </Button>
            </View>
        </View>
    )
}

export default RegisterProfileImage

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
    ProfileContainer: {
        windowHeight: props.windowWidth,
        height: props.windowHeight / 2.2,
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