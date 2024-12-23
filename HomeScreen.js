import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get the JWT token from AsyncStorage
        const response = await axios.get('http://your-backend-url/api/documents', {
          headers: {
            Authorization: token,
          },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        Alert.alert('Error', 'Could not fetch documents. Please try again later.');
      }
    };

    fetchDocuments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.documentItem}>
      <Text style={styles.documentTitle}>{item.fileUrl.split('/').pop()}</Text>
      <Button
        title="View"
        onPress={() => {
          // Handle viewing the document (e.g., open in a PDF viewer)
          Alert.alert('View Document', `You can view the document at: ${item.fileUrl}`);
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Documents</Text>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={documents.length === 0 ? styles.emptyList : null}
      />
      <Button
        title="Upload New Document"
        onPress={() => navigation.navigate('Upload')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  documentTitle: {
    fontSize: 18,
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;