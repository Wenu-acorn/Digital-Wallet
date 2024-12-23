import React from 'react';
import { View, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const UploadScreen = () => {
  const uploadPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const formData = new FormData();
      formData.append('file', {
        uri: res.uri,
        name: res.name,
        type: res.type,
      });

      await axios.post('http://your-backend-url/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('User  cancelled the picker');
      } else {
        alert('Error: ' + err);
      }
    }
  };

  return (
    <View>
      <Button title="Upload PDF" onPress={uploadPDF} />
    </View>
  );
};

export default UploadScreen;