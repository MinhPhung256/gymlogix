import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApis, endpoints } from '../../configs/Apis';

const ChooseRole = ({ visible, onClose, currentRole, token }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (currentRole === 1) {
      setSelectedRole('user');
    } else if (currentRole === 2) {
      setSelectedRole('expert');
    } else {
      setSelectedRole(null);
    }
  }, [currentRole, visible]);

  const handleSelectRole = async (role) => {
    setSelectedRole(role);

    const newRoleNumber = role === 'user' ? 1 : 2;

    if (newRoleNumber === currentRole) {
      onClose();
      if (newRoleNumber === 1) {
        navigation.navigate('HomeStack');
      } else {
        navigation.navigate('HomeCoach');
      }
      return;
    }

    try {
      const api = authApis(token);
      const response = await api.patch(endpoints['update-user'], {
        role: newRoleNumber,
      });

      if (response.status === 200) {
        onClose();
        if (newRoleNumber === 1) {
          navigation.navigate('HomeStack');
        } else {
          navigation.navigate('HomeUser');
        }
      } else {
        Alert.alert('Lỗi', 'Cập nhật vai trò thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật vai trò:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật vai trò.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Chọn vai trò của bạn</Text>

          <TouchableOpacity
            style={[styles.optionButton, selectedRole === 'user' && styles.selectedButton]}
            onPress={() => handleSelectRole('user')}
          >
            <Text style={[styles.optionText, selectedRole === 'user' && styles.selectedText]}>
              Tự theo dõi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, selectedRole === 'expert' && styles.selectedButton]}
            onPress={() => handleSelectRole('expert')}
          >
            <Text style={[styles.optionText, selectedRole === 'expert' && styles.selectedText]}>
              Kết nối chuyên gia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#B00000',
    borderColor: '#B00000',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#B00000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChooseRole;
