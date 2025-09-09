import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon} from "react-native-paper";
import { ImageBackground } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MyDispatchContext, MyUserContext } from "./configs/UserContext";
import { useContext, useReducer } from "react";
import ActivityDetail from "./components/ActivityDetail";
import ChooseRole from "./components/User/ChooseRole";
import CreateGoal from "./components/User1/Goal";
import Dashboard from "./components/Home/Dashboard";
import EditProfile from "./components/User/EditProfile";
import ExpertInfo from "./components/user2/ExpertInfo";
import HealthDiary from "./components/User1/HealthDiary";
import Home from "./components/Home/Home";
import Login from "./components/User/Login";
import MealPlan from "./components/User1/MealPlan";
import MyUserReducer from "./configs/UserReducer";
import Profile from "./components/User/Profile";
import ProfileInput from "./components/User1/ProfileInput"; 
import Register from "./components/User/Register";
import Reminders from "./components/User1/Reminders";
import WorkoutPlan from "./components/User1/WorkoutPlan";
import ChangePassword from "./components/User/ChangePassword";
// import HomeExpert from "./components/HomeExpert";

const Stack = createNativeStackNavigator();

const IndexStack = () => {
  return (
    <Stack.Navigator
       screenOptions={{
        headerBackTitleStyle: {
          color: '#B00000',  
        },
        headerStyle: {
          backgroundColor: '#BB0000'
        },
        headerTitleStyle: {
          color: 'white'
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} options={{title: "SỔ TAY QUẢN LÝ SỨC KHOẺ", headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{title: "Đăng nhập", headerShown: false}}/>
      <Stack.Screen name="Register" component={Register} options={{title: "Đăng ký", headerShown: false}}/>
    </Stack.Navigator>
  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator
       screenOptions={{
        headerStyle: {
          backgroundColor: '#000099'
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 20
        },
        headerTintColor: 'white',
        headerBackground: () => (
          <ImageBackground
            source={require('../reactmobileapp/assets/Images/background1.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{  title: "SỔ TAY QUẢN LÝ SỨC KHOẺ", headerShown: false }} />
      <Stack.Screen name="ChooseRole" component={ChooseRole} options={{ title: "CHẾ ĐỘ"}}/>
      <Stack.Screen name="ProfileInput" component={ProfileInput} options={{title: "Theo dõi sức khoẻ", headerShown: false}}/>
      <Stack.Screen name="MealPlan" component={MealPlan} options={{title: "Thực đơn dinh dưỡng", headerShown: false}}/>
      <Stack.Screen name="WorkoutPlan" component={WorkoutPlan} options={{title: "Lịch tập luyện", headerShown: false}}/>
      <Stack.Screen name="ActivityDetail" component={ActivityDetail} options={{title: "Hoạt động"}}/>
      <Stack.Screen name="CreateGoal" component={CreateGoal} options={{title: "Mục tiêu", headerShown: false }}/>
    </Stack.Navigator>
  );
}



const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: 'white',
          fontSize: 22
        },
        headerTintColor: 'white',
        headerBackground: () => (
          <ImageBackground
            source={require('../reactmobileapp/assets/Images/background1.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
      }}
    >
          <Stack.Screen name="Profile" component={Profile} options={{ title: 'Tài khoản', headerBackVisible: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Chỉnh sửa thông tin', headerShown: false  }} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Đổi mật khẩu', headerShown: false  }} />

      </Stack.Navigator>
  );
};

const ReminderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: 'white',
          fontSize: 22
        },
        headerTintColor: 'white',
        headerBackground: () => (
          <ImageBackground
            source={require('../reactmobileapp/assets/Images/background1.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
      }}
    >
          <Stack.Screen name="Reminder" component={Reminders} options={{ title: 'Thông báo', headerBackVisible: false }} />
      </Stack.Navigator>
  );
};


const DiaryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: 'white',
          fontSize: 22
        },
        headerTintColor: 'white',
        headerBackground: () => (
          <ImageBackground
            source={require('../reactmobileapp/assets/Images/background1.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
      }}
    >
          <Stack.Screen name="Diary" component={HealthDiary} options={{ title: 'Nhật kí', headerBackVisible: false }} />
      </Stack.Navigator>
  );
};

const CoachStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen name="HomeExpert" component={HomeExpert} options={{ title: 'SỔ TAY QUẢN LÝ SỨC KHOẺ', headerBackVisible: false }} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetail} options={{title: "Hoạt động"}}/>
          
      </Stack.Navigator>
  );
};




const ChatStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen name="Chat" component={Chat} options={{ title: 'Tin nhắn' }} />
      </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerStyle: { backgroundColor: '#000099' },
        tabBarActiveTintColor: '#000099',
        headerTitleStyle: { fontSize: 18, color: 'white' },
        headerTintColor: 'white',
      }}
    >
      {user === null ? 
        <Tab.Screen name="IndexStack" component={IndexStack} options={{ headerShown: false, tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        : <>
            {user.role === 1 && <>
              <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
              <Tab.Screen name="DiaryStack" component={DiaryStack} options={{ headerShown: false, tabBarLabel: 'Nhật kí', tabBarIcon: ({ color, size }) => <Icon source="book" color={color} size={size} /> }} />
              <Tab.Screen name="ReminderStack" component={ReminderStack} options={{headerShown: false, tabBarLabel: 'Thông báo', tabBarIcon: ({ color, size }) => <Icon source="bell" color={color} size={size} /> }} />
            </>}
            {user.role === 2 && <>
              <Tab.Screen name="CoachStack" component={CoachStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
              <Tab.Screen name="ExpertInfo" component={ExpertInfo} options={{ tabBarLabel: 'Kết nối', tabBarIcon: ({ color, size }) => <Icon source="account-group" color={color} size={size} /> }} />
              <Tab.Screen name="ChatStack" component={ChatStack} options={{ tabBarLabel: 'Tin nhắn', tabBarIcon: ({ color, size }) => <Icon source="chat" color={color} size={size} /> }} />
            </>}
            <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ headerShown: false, tabBarLabel: 'Người dùng', tabBarIcon: ({ color, size }) => <Icon source="account-cog" color={color} size={size} /> }} />
          </>
      }
    </Tab.Navigator>
  );
};
const App = () =>{
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <PaperProvider> 
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </PaperProvider>
    
  );
}

export default App;
