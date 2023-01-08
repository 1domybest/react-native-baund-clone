import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native'
import { makeStyles } from '@rneui/themed';
import { ROUTES } from '../../../constants/routes'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';
const RegisterProfileImage = (props) => {
    const { navigation } = props;
    const toggleCheckbox = () => setChecked(!checked);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = useStyles(props, windowWidth, windowHeight);
    const [checked, setChecked] = React.useState(true);
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 5 }}>
                <Text style={styles.title}>프로필 이미지를 등록하세요.</Text>
            </View>
            <View style={{ backgroundColor: '#363535', position: 'relative' }}>
                <TouchableOpacity>
                    <Image source={require('../../../assets/baundProfileImage.png')} style={{ height: windowHeight / 2.2, width: windowWidth }} />
                </TouchableOpacity>
                <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <Avatar.Icon size={35} icon="camera" color='white' style={{ backgroundColor: 'grey' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', bottom: 10, left: 10, flexDirection: 'row' }}>
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity>
                            <Avatar.Icon size={65} icon="account" color='white' style={{ backgroundColor: 'lightgrey' }} />
                            <Avatar.Icon size={30} icon="camera" color='white' style={{ backgroundColor: '#363535', position: 'absolute', top: -5, right: -5 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: 'white', fontSize: 30 }}>user_name</Text>
                        <Text style={{ color: 'white', fontSize: 18 }}>user_nickName</Text>
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
            <View style={{width: '100%'}}>
                <Button mode="contained" style={true ? styles.activeButton : styles.inActiveButton} disabled={false}>
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
        backgroundColor: theme.colors.grey1,
        width: '100%',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
     inActiveButton: {
        marginTop: 10, 
        width: '100%',
        backgroundColor: theme.colors.grey4,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
}));