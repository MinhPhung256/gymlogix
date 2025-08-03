import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { authApis, endpoints } from '../configs/Apis'; 


const LeftContent = (icon) => (props) => <Avatar.Icon {...props} icon={icon} backgroundColor="#B00000" />;

const ActivityCard = ({ activity, onPress }) => (
  <TouchableOpacity onPress={() => onPress(activity)}>
    <Card style={{ marginBlock: 8, marginInline: 16, backgroundColor: '#FFEBEE' }}>
      <Card.Title title={activity.name} subtitle={activity.calories_burned ? `${activity.calories_burned} calo` : ''} left={LeftContent('run')} style={{ color: '#B00000' }} />
      <Card.Content>
        <Text variant="titleLarge">{activity.name}</Text>
        <Text variant="bodyMedium">{activity.description}</Text>
      </Card.Content>
      <Card.Cover source={{ uri: activity.image_url }} />
      <Card.Actions>
        <Button style={{ backgroundColor: '#B00000' }} labelStyle={{ color: 'white' }} onPress={() => onPress(activity)}>Xem</Button>
      </Card.Actions>
    </Card>
  </TouchableOpacity>
);

const ActivityList = ({ navigation, token }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadActivities = async () => {
      try {
        const api = authApis(token); 
        const response = await api.get(endpoints['activity-list']); 
  
        if (response.data && Array.isArray(response.data.results)) {
          setActivities(response.data.results); 
        } else {
          setActivities([]); 
        }
      } catch (err) {
        setError('Lỗi khi tải hoạt động.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    loadActivities(); 
  
  }, [token]);  

 
  const onActivityPress = (activity) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#B00000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="bodyLarge" style={{ color: 'red' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} onPress={onActivityPress} />
      ))}
    </View>
  );
};

export default ActivityList;
