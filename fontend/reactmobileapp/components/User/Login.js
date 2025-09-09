import { useContext, useState } from "react";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import { View, ScrollView, Text, TouchableOpacity, ImageBackground } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import MyStyles from '../../styles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import { MyDispatchContext } from "../../configs/UserContext";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const info = [
    {
      label: 'Tên đăng nhập',
      field: 'username',
      secureTextEntry: false,
      icon: "account"
    },
    {
      label: 'Mật khẩu',
      field: 'password',
      secureTextEntry: true,
      icon: "lock" // **Chỗ này sẽ được override thành icon con mắt**
    }
  ];

  const [user, setUser] = useState({});
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // **Mới: trạng thái ẩn/hiện mật khẩu**
  const dispatch = useContext(MyDispatchContext);
  const navigation = useNavigation();

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const validate = () => {
    if (Object.values(user).length === 0) {
      setMsg("Vui lòng nhập thông tin!");
      return false;
    }

    for (let i of info) {
      let val = user[i.field] || '';
      if (val.trim() === '') {
        setMsg(`Vui lòng nhập ${i.label}`);
        return false;
      }

      if (i.field === 'username' && val.includes(' ')) {
        setMsg("Tên đăng nhập không được chứa khoảng trắng");
        return false;
      }
    }

    setMsg("");
    return true;
  };

  const login = async () => {
    if (validate() === true) {
      try {
        setLoading(true);
  
        let form = qs.stringify({
          ...user,
          client_id: "xYf9dz566bhcch6VOmFTMVdipHPN1p0AOSuiIb5W",
          client_secret: "nTImOFAiQf0IGZgM8fgPGXJDZQwdmepJqZLdZk5QSFINuXUBCwHFSgNQiGxCRP9avuUL4MR6P1BUlMSOXtN7KzdBkXnumXhzwosCwLZoI5oYfpvFMkaoe7M2gOsMhT1b",
          grant_type: "password"
        });
  
        let res = await Apis.post(endpoints['login'], form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        await AsyncStorage.setItem('token', res.data.access_token);
  
        let u = await authApis(res.data.access_token).get(endpoints['current-user']);
        console.info(u.data);
  
        dispatch({
          type: "login",
          payload: {
            ...u.data,
            token: res.data.access_token
          }
        });

  
      } catch (ex) {
        if (ex.response) {
          console.error('Error response:', ex.response);
          setMsg(ex.response.data.message || "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
        } else {
          console.error('Error message:', ex.message);
          setMsg("Đã xảy ra lỗi. Vui lòng thử lại sau");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <ImageBackground
      source={require('../../assets/Images/background1.jpg')}
      style={MyStyles.background}
      resizeMode="cover"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={MyStyles.box}>
          
          {/* Header trong box */}
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            {/* Nút trở lại */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
              <Text style={{ fontSize: 22, color: '#000099' }}>←</Text>
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={[MyStyles.title, { flex: 1, textAlign: 'center', marginRight: 27, marginBottom:5, marginTop: 15 }]}>
              Đăng nhập
            </Text>
          </View>

          {/* Nội dung form */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 5 }}
          >
            <HelperText type="error" visible={!!msg}>{msg}</HelperText>

            {info.map(i => {
              const isPassword = i.field === 'password'; 
              return (
                <TextInput
                  key={i.field}
                  value={user[i.field] || ''}
                  onChangeText={t => setState(t, i.field)}
                  label={i.label}
                  secureTextEntry={isPassword ? !showPassword : i.secureTextEntry} 
                  right={
                    isPassword ? (
                      <TextInput.Icon
                        icon={showPassword ? "eye" : "eye-off"} 
                        onPress={() => setShowPassword(!showPassword)} 
                      />
                    ) : (
                      <TextInput.Icon icon={i.icon} />
                    )
                  }
                  style={[MyStyles.margin, {
                    marginTop: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    fontSize: 14,
                    marginBottom: 10,
                    width: '95%',
                    alignSelf: 'center'
                  }]}
                  theme={{
                    colors: {
                      text: '#000099',
                      primary: '#000099',
                      placeholder: 'gray',
                    }
                  }}
                />
              );
            })}

            <Button
              style={{ backgroundColor: "#000099", marginTop: 15 }}
              disabled={loading}
              loading={loading}
              onPress={login}
              mode="contained"
            >
              Đăng nhập
            </Button>

            {/* Dòng Quên mật khẩu */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')} // tên route màn hình quên mật khẩu
              style={{ alignSelf: 'flex-end', marginTop: 10 }}
            >
              <Text style={{ color: '#000099', fontSize: 14 }}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'gray', textAlign: 'center', marginTop: 15 }}>
                Bạn chưa có tài khoản, hãy{" "}
                <Text style={{ color: '#000099', fontWeight: 'bold' }}>đăng ký</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;
