import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/UserContext";

const ExpertInfo = () => {
  const [experts, setExperts] = useState([]);
  const currentUser = useContext(MyUserContext);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        let res = await authApis(currentUser.token).get(endpoints['get-all-users']);
        const allUsers = res.data;

        const filteredExperts = allUsers.filter(u => u.role === 3);
        setExperts(filteredExperts);
      } catch (err) {
        console.error("Lỗi khi tải danh sách chuyên gia:", err);
      }
    };

    loadExperts();
  }, []);

  return (
    <FlatList
      data={experts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
          <Text>{item.full_name || item.name}</Text>
        </View>
      )}
    />
  );
};

export default ExpertInfo;
