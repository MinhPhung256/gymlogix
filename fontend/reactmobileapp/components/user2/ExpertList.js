import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApis, endpoints } from '../../configs/Apis';

const ExpertsList = ({ token }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  
    const loadExperts = async () => {
      try {
        setLoading(true);
        
        const api = authApis(token);
        const response = await api.get(endpoints['get-all-users']);
        const expertsData = response.data.filter(user => user.role === 2);
        setExperts(expertsData);
      } catch (error) {
        console.error('Lỗi lấy danh sách chuyên gia:', error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    loadExperts();
  }, [token]);

  const renderExpertItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ExpertDetail', { expert: item })}
    >
      <Image source={{ uri: item.avatar || 'https://via.placeholder.com/80' }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty || 'Chuyên gia'}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description || 'Không có mô tả'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#B00000" />
      </View>
    );
  }

  return (
    <FlatList
      data={experts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderExpertItem}
      contentContainerStyle={experts.length === 0 && styles.center}
      ListEmptyComponent={<Text>Chưa có chuyên gia nào.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  specialty: {
    fontSize: 14,
    color: '#B00000',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
});

export default ExpertsList;
