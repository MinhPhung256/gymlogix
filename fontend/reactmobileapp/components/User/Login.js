import { useContext, useState } from "react";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import { ScrollView, Text, TouchableOpacity} from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
import MyStyles from '../../styles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import { MyDispatchContext } from "../../configs/UserContext";
import { useNavigation } from "@react-navigation/native";

const Login = () =>{
    const info = [{
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
        }];

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const navigation = useNavigation();


    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }


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
        if(validate() === true) {
            try{
                setLoading(true);

                let form = qs.stringify({
                  ...user,
                  client_id: "uIYv1mlMlvaGg0d1GqqHiMfqIzcOjyv65uuVR3rd",
                  client_secret: "JhbJR58y3fo7RTugTGA9msbJVGUTsioLqqBOOEl8UXzL4Fm9NqPjLM8Yy7VHhOEOsn8XChSxLCfkeLjV74f3ECBD1GYR0NTbbeJO7mhqL5oSvmioPsji0Rosw2RXxmul",
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

            }  catch (ex) {
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
          <ScrollView style={MyStyles.p}>
            <HelperText type="error" visible={!!msg}>{msg}</HelperText>
            {info.map(i => (
              <TextInput
                key={i.field}
                value={user[i.field] || ''}
                onChangeText={t => setState(t, i.field)}
                label={i.label}
                secureTextEntry={i.secureTextEntry}
                right={<TextInput.Icon icon={i.icon} />}
                style={[MyStyles.margin, {
                  backgroundColor: 'white',
                  borderRadius: 10,
                  fontSize: 16
                }]}
                theme={{
                  colors: {
                    text: '#B00000',
                    primary: '#B00000',
                    placeholder: 'gray',
                  }
                }}
              />
            ))}

            <Button style={{ backgroundColor: "#B00000" }} disabled={loading} loading={loading} onPress={login} mode="contained">
              Đăng nhập
            </Button>

            

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'gray', textAlign: 'center', marginTop: 10 }}>
                Nếu bạn chưa có tài khoản, hãy <Text style={{ color: '#B00000', fontWeight: 'bold'}}>đăng ký</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        );
      };
      
      export default Login;