// import React, { useState } from 'react';
// import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { Card, Text, Button, Avatar } from 'react-native-paper';

// // Dữ liệu mẫu user
// const sampleUsers = [
//   {
//     id: 1,
//     full_name: 'Hi',
//     email: 'dhhf@gmail.com',
//     role: 'Người dùng',
//     avatar_url: require('../../assets/Images/avatar1.jpg'),
//     bmi: 22.5,
//     water_intake: '2 lít/ngày',
//     steps: 8000,
//     goal: 'Giảm 3kg trong 2 tháng',
//   },
//   {
//     id: 2,
//     full_name: 'Candy',
//     email: 'candy@gmail.com',
//     role: 'Người dùng',
//     avatar_url: require('../../assets/Images/avatar2.jpg'),
//     bmi: 19.8,
//     water_intake: '1.8 lít/ngày',
//     steps: 6000,
//     goal: 'Giữ dáng khỏe mạnh',
//   },
//   {
//     id: 3,
//     full_name: 'ok',
//     email: 'rhb@gmail.com',
//     role: 'Người dùng',
//     avatar_url: require('../../assets/Images/avatar3.jpg'),
//     bmi: 25.3,
//     water_intake: '2.2 lít/ngày',
//     steps: 10000,
//     goal: 'Tăng cơ trong 3 tháng',
//   },
// ];

// const UserCard = ({ user, onPress }) => (
//   <TouchableOpacity onPress={() => onPress(user)}>
//     <Card style={styles.card}>
//       <Card.Title
//         title={user.full_name}
//         subtitle={user.email}
//         left={(props) => <Avatar.Image {...props} source={user.avatar_url} />}
//       />
//       <Card.Content>
//         <Text style={styles.roleText}>Role: {user.role}</Text>
//       </Card.Content>
//       <Card.Actions>
//         <Button
//           mode="contained"
//           buttonColor="#000099"
//           textColor="white"
//           style={styles.button}
//           onPress={() => onPress(user)}
//         >
//           Xem thông tin
//         </Button>
//       </Card.Actions>
//     </Card>
//   </TouchableOpacity>
// );

// const UserList = ({ navigation }) => {
//   const [users] = useState(sampleUsers);

//   const onUserPress = (user) => {
//     navigation.navigate('UserDetail', { user }); // ✅ bọc user trong object
//   };

//   return (
//     <FlatList
//       data={users}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item }) => <UserCard user={item} onPress={onUserPress} />}
//       contentContainerStyle={styles.listContainer}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   listContainer: {
//     paddingVertical: 16,
//   },
//   card: {
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: '#000099',
//     backgroundColor: '#fff',
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 5,
//     width: '95%',
//     alignSelf: 'center',
//   },
//   roleText: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 4,
//   },
//   button: {
//     borderRadius: 12,
//   },
// });

// export default UserList;
