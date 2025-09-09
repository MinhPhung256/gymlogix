import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { TouchableOpacity, Image, ScrollView, Text, KeyboardAvoidingView, View, ImageBackground } from "react-native";
import { TextInput, Button, HelperText, Checkbox, RadioButton } from "react-native-paper";
import MyStyles from '../../styles/MyStyles';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";


const Register = () =>{
    const info = [
        {
            label: 'Tên',
            field: 'first_name',
            secureTextEntry: false,
            icon: "text"
        },
        {
            label: 'Họ và tên lót',
            field: 'last_name',
            secureTextEntry: false,
            icon: "text"
        },
        {
            label: 'Email',
            field: 'email',
            secureTextEntry: false,
            icon: "email"
        },{
            label: 'Tên đăng nhập',
            field: 'username',
            secureTextEntry: false,
            icon: "account"
        },
        {
            label: 'Mật khẩu',
            field: 'password',
            secureTextEntry: true,
            icon: "lock"
        },
        {
            label: 'Xác nhận mật khẩu',
            field: 'confirm_password',
            secureTextEntry: true,
            icon: "lock-check"

        },
        ];

        const [user, setUser] = useState({});
        const [msg, setMsg] = useState(null);
        const [loading, setLoading] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [role, setRole] = useState('1');
      
        const nav = useNavigation();
      
        const setState = (value, field) => setUser({ ...user, [field]: value });
      
        const picker = async () => {
          let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert("Permissions denied!");
          } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) setState(result.assets[0], 'avatar');
          }
        };
      
        const validate = () => {
            if (Object.values(user).length === 0) {
              setMsg("Vui lòng nhập thông tin!");
              return false;
            }
          
            if (user.password !== user.confirm_password) {
              setMsg('Mật khẩu và xác nhận mật khẩu không khớp!');
              return false;
            }
          
            for (let i of info) {
              const val = user[i.field];
              if (!val) {
                setMsg(`Vui lòng nhập ${i.label}`);
                return false;
              }
              if (i.field === 'email') {
                const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailTest.test(val)) {
                  setMsg("Email không hợp lệ");
                  return false;
                }
              }
              if (i.field === 'password' && val.length < 6) {
                setMsg("Mật khẩu phải có ít nhất 6 ký tự");
                return false;
              }
              if (i.field === 'username' && val.includes(' ')) {
                setMsg("Tên đăng nhập không được chứa khoảng trắng");
                return false;
              }
            }
          
            // ✅ Dùng state role, không dùng user.role
            if (!['1','2','3'].includes(role)) {
              setMsg("Vui lòng chọn vai trò");
              return false;
            }
          
            setMsg("");
            return true;
          };
          
      
          const register = async () => {
            if (!validate()) return;
            try {
              setLoading(true);
              let form = new FormData();
              for (let key in user) {
                if (key === 'avatar') {
                  form.append('avatar', {
                    uri: user.avatar.uri,
                    name: user.avatar.fileName || 'avatar.jpg',
                    type: user.avatar.type || 'image/jpeg'
                  });
                } else {
                  form.append(key, user[key]);
                }
              }
          
              // ✅ Thêm role từ state riêng
              form.append('role', parseInt(role));
          
              form.append('confirm_password', user.confirm_password);
          
              let res = await Apis.post(endpoints['register'], form, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
          
              if (res.status === 200 || res.status === 201) nav.navigate('Login');
          
            } catch (ex) {
              const err = ex.response?.data;
              setMsg(
                err?.username?.[0] ||
                err?.email?.[0] ||
                err?.non_field_errors?.[0] ||
                err?.message ||
                (ex.message === 'Network Error' ? 'Không thể kết nối đến máy chủ!' : 'Đăng ký thất bại!')
              );
            } finally {
              setLoading(false);
            }
          };
          
        return (
            <ImageBackground source={require('../../assets/Images/background1.jpg')} style={{ flex: 1 }} resizeMode="cover">
              <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {/* Box chính */}
                  <View style={[MyStyles.box, { width: '90%', padding: 15 }]}>
                    {/* Header với mũi tên */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 15}}>
                      <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 5 }}>
                        <Text style={{ fontSize: 22, color: '#000099' }}>←</Text>
                      </TouchableOpacity>
                      <Text style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#000099', marginRight: 27 }}>
                        Đăng ký
                      </Text>
                    </View>
          
                    <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                      <HelperText type="error" visible={!!msg}>{msg}</HelperText>
          
                      {info.map(i => {
                        const isPassword = i.field === 'password';
                        const isConfirm = i.field === 'confirm_password';
                        return (
                          <TextInput
                            key={i.field}
                            value={user[i.field] || ''}
                            onChangeText={t => setState(t, i.field)}
                            label={i.label}
                            secureTextEntry={isPassword ? !showPassword : isConfirm ? !showConfirmPassword : i.secureTextEntry}
                            right={
                              isPassword ? (
                                <TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />
                              ) : isConfirm ? (
                                <TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />
                              ) : (
                                <TextInput.Icon icon={i.icon} />
                              )
                            }
                            style={{
                              backgroundColor: 'white',
                              borderRadius: 10,
                              fontSize: 16,
                              marginBottom: 10,
                              paddingHorizontal: 10,
                              height: 45,
                              width: '95%',        // giảm chiều ngang
                              alignSelf: 'center'
                            }}
                            theme={{ colors: { text: '#000099', primary: '#000099', placeholder: 'gray' } }}
                          />
                        );
                      })}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <RadioButton
                          value="1"
                          status={role === '1' ? 'checked' : 'unchecked'}
                          onPress={() => setRole('1')}
                          color="#000099"
                        />
                        <Text style={{ marginRight: 20 }}>Người dùng</Text>

                        <RadioButton
                          value="2"
                          status={role === '2' ? 'checked' : 'unchecked'}
                          onPress={() => setRole('2')}
                          color="#000099"
                        />
                        <Text>Huấn luyện viên</Text>
                      </View>
          
                      <TouchableOpacity onPress={picker} style={{ marginBottom: 10 }}>
                        <Text style={{ color: '#000099', marginLeft: 17 }}>Chọn ảnh đại diện...</Text>
                      </TouchableOpacity>
          
                      {user?.avatar && <Image source={{ uri: user.avatar.uri }} style={[MyStyles.logo, { marginBottom: 10 }]} />}
          
                      {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <Checkbox
                            status={agree ? 'checked' : 'unchecked'}
                            onPress={() => setAgree(!agree)}
                            color="#000099"          // màu khi checked
                            uncheckedColor="#ffffff" // ô vuông khi chưa check sẽ trắng
                            style={[MyStyles.tick]}
                        />
                        <Text style={{ fontSize: 13, marginLeft: 5, color: '#000' }}>
                            Tôi đồng ý với <Text style={{ color: '#000099', fontWeight: 'bold' }}>Điều khoản & Điều kiện</Text>
                        </Text>
                        </View> */}
          
                      <Button
                        style={{ backgroundColor: "#000099", marginBottom: 20, marginTop: 10 }}
                        loading={loading}
                        mode="contained"
                        onPress={register}
                        labelStyle={{ color: 'white', fontWeight: 'bold' }}
                      >
                        Đăng ký
                      </Button>
                    </ScrollView>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ImageBackground>
          );     
        }     
export default Register;

