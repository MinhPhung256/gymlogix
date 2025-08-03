import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon} from "react-native-paper";
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
import HomeUser from "./components/Home/HomeUser";
import Login from "./components/User/Login";
import MealPlan from "./components/MealPlan";
import MyUserReducer from "./configs/UserReducer";
import Profile from "./components/User/Profile";
import ProfileInput from "./components/User1/ProfileInput"; 
import Register from "./components/User/Register";
import Reminders from "./components/User1/Reminders";
// import Statistics from "./components/User1/Statistics";
// import ExpertsList from "./components/user2/ExpertList";
// import ExpertDetail from "./components/user2/ExpertDetail";
import WorkoutPlan from "./components/User1/WorkoutPlan";
import ChangePassword from "./components/ChangePassword";

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
      <Stack.Screen name="Dashboard" component={Dashboard} options={{title: "SỔ TAY QUẢN LÝ SỨC KHOẺ" }} />
      <Stack.Screen name="Login" component={Login} options={{title: "Đăng nhập" }}/>
      <Stack.Screen name="Register" component={Register} options={{title: "Đăng ký"}}/>
    </Stack.Navigator>
  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator
       screenOptions={{
        headerStyle: {
          backgroundColor: '#BB0000'
        },
        headerTitleStyle: {
          color: 'white'
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{  title: "SỔ TAY QUẢN LÝ SỨC KHOẺ" }} />
      <Stack.Screen name="ChooseRole" component={ChooseRole} options={{ title: "CHẾ ĐỘ"}}/>
      <Stack.Screen name="ProfileInput" component={ProfileInput} options={{title: "Theo dõi sức khoẻ"}}/>
      <Stack.Screen name="MealPlan" component={MealPlan} options={{title: "Thực đơn dinh dưỡng"}}/>
      <Stack.Screen name="WorkoutPlan" component={WorkoutPlan} options={{title: "Lịch tập luyện"}}/>
      <Stack.Screen name="ActivityDetail" component={ActivityDetail} options={{title: "Hoạt động"}}/>
      <Stack.Screen name="CreateGoal" component={CreateGoal} options={{title: "Mục tiêu"}}/>

    </Stack.Navigator>
  );
}

const UserStack = () => {
  return (
    <Stack.Navigator
       screenOptions={{
        headerStyle: {
          backgroundColor: '#BB0000'
        },
        headerTitleStyle: {
          color: 'white'
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name="HomeUser" component={HomeUser} options={{  title: "SỔ TAY QUẢN LÝ SỨC KHOẺ" }} />
      <Stack.Screen name="ChooseRole" component={ChooseRole} options={{ title: "CHẾ ĐỘ"}}/>
      <Stack.Screen name="ProfileInput" component={ProfileInput} options={{title: "Theo dõi sức khoẻ"}}/>
      <Stack.Screen name="MealPlan" component={MealPlan} options={{title: "Gợi ý dinh dưỡng"}}/>
      <Stack.Screen name="WorkoutPlan" component={WorkoutPlan} options={{title: "Thống kê sức khoẻ"}}/>
      <Stack.Screen name="ActivityDetail" component={ActivityDetail} options={{title: "Hoạt động"}}/>
      <Stack.Screen name="CreateGoal" component={CreateGoal} options={{title: "Mục tiêu"}}/>

    </Stack.Navigator>
  );
}


const ProfileStack = () => {
  return (
    <Stack.Navigator
       screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#BB0000'
        },
        headerTitleStyle: {
          color: 'white'
        },
        headerTintColor: 'white',
      }}
    >
          <Stack.Screen name="Profile" component={Profile} options={{ title: 'TÀI KHOẢN', headerBackVisible: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Chỉnh sửa thông tin' }} />

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
        headerStyle: { backgroundColor: '#BB0000' },
        tabBarActiveTintColor: '#BB0000',
        headerTitleStyle: { fontSize: 18, color: 'white' },
        headerTintColor: 'white',
      }}
    >
      {user === null ? 
        <Tab.Screen name="IndexStack" component={IndexStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
        : <>
            {user.role === 1 && <>
              <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
              <Tab.Screen name="HealthDiary" component={HealthDiary} options={{ title: 'Nhật kí', tabBarLabel: 'Nhật kí', tabBarIcon: ({ color, size }) => <Icon source="book" color={color} size={size} /> }} />
              <Tab.Screen name="Reminders" component={Reminders} options={{ title: 'Thông báo', tabBarLabel: 'Thông báo', tabBarIcon: ({ color, size }) => <Icon source="bell" color={color} size={size} /> }} />
             
            </>}
            {user.role === 2 && <>
              <Tab.Screen name="UserStack" component={UserStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
              <Tab.Screen name="ExpertInfo" component={ExpertInfo} options={{ tabBarLabel: 'Kết nối', tabBarIcon: ({ color, size }) => <Icon source="account-group" color={color} size={size} /> }} />
              <Tab.Screen name="Reminders" component={Reminders} options={{ title: 'Thông báo', tabBarLabel: 'Thông báo', tabBarIcon: ({ color, size }) => <Icon source="bell" color={color} size={size} /> }} />
            </>}
            {user.role === 3 && <>
              <Tab.Screen name="CoachStack" component={CoachStack} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} /> }} />
              <Tab.Screen name="ExpertInfo" component={ExpertInfo} options={{ tabBarLabel: 'Kết nối', tabBarIcon: ({ color, size }) => <Icon source="account-group" color={color} size={size} /> }} />
              <Tab.Screen name="ChatStack" component={ChatStack} options={{ tabBarLabel: 'Tin nhắn', tabBarIcon: ({ color, size }) => <Icon source="chat" color={color} size={size} /> }} />
            </>}
            <Tab.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Đổi mật khẩu', tabBarLabel: 'Đổi mật khẩu', tabBarIcon: ({ color, size }) => <Icon source="lock" color={color} size={size} /> }} />
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
