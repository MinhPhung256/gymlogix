import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ExpertDetail = ({ route }) => {
  const { expert } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: expert.avatar || 'https://via.placeholder.com/120' }} style={styles.avatar} />
      <Text style={styles.name}>{expert.name}</Text>
      <Text style={styles.specialty}>{expert.specialty || 'Chuyên gia'}</Text>

      <Text style={styles.sectionTitle}>Mô tả</Text>
      <Text style={styles.description}>{expert.description || 'Không có mô tả chi tiết.'}</Text>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  specialty: {
    fontSize: 18,
    color: '#B00000',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 6,
    textAlign: 'justify',
  },
});

export default ExpertDetail;
