import React from 'react';
import { ScrollView} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

const ActivityDetail = ({ route, navigation }) => {
  const { activity } = route.params;

  const dateNow = new Date();
  const formattedDate = dateNow.toLocaleDateString(); 
  const timeRange = activity.subtitle;

  return (
    <ScrollView style={{ flex: 1, padding:15 }}>
      <Card style={{ backgroundColor: '#FFEBEE' }}>
        <Card.Title title={activity.title} subtitle={`${formattedDate} | ${timeRange}`} />
        <Card.Cover source={{ uri: activity.image_url }} />
        <Card.Content style={{ marginTop: 16 }}>
          <Text variant="bodyLarge">{activity.description}</Text>
          <Text style={{ marginTop: 12, fontStyle: 'italic', color: '#666' }}>
            Ngày chi tiết: {formattedDate}
          </Text>
          <Text>Thời gian: {timeRange}</Text>
        </Card.Content>
        <Card.Actions>
        <Button mode="outlined" onPress={() => navigation.goBack()}  textColor="#B00000" style={{ borderColor: '#B00000', borderWidth: 1, margin: 8 }}>
            Quay lại
            </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default ActivityDetail;
