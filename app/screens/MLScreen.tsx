import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Firebase Web SDK import
import { app } from '../../config/firebaseConfig';

// Import react-native-ml-kit for text recognition
import TextRecognition from '@react-native-ml-kit/text-recognition';

// Initialize Firebase
let firebaseInitialized = true;

export default function MLScreen() {
  const router = useRouter();
  const [imagePath, setImagePath] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<string>('');

  useEffect(() => {
    // Kiểm tra trạng thái Firebase khi component mount
    if (firebaseInitialized && app) {
      setFirebaseStatus('✅ Firebase đã được khởi tạo thành công');
    } else {
      setFirebaseStatus('⚠️ Firebase chưa được cấu hình, sử dụng mock mode');
    }
  }, []);

  // Yêu cầu quyền truy cập camera
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh');
      return false;
    }
    return true;
  };

  // Yêu cầu quyền truy cập thư viện ảnh
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh');
      return false;
    }
    return true;
  };

  // Chụp ảnh từ camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setImagePath(imageUri);
        setRecognizedText(''); // Reset kết quả cũ
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setImagePath(imageUri);
        setRecognizedText(''); // Reset kết quả cũ
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  // Xử lý khi nhập đường dẫn ảnh
  const handleImagePathChange = (path: string) => {
    setImagePath(path);
    if (path) {
      setSelectedImage(path);
      setRecognizedText(''); // Reset kết quả cũ
    } else {
      setSelectedImage(null);
    }
  };

  async function recognizeTextFromImage(localPath: string) {
    if (!localPath) {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc chụp ảnh trước');
      return;
    }

    try {
      setIsProcessing(true);
      
      if (firebaseInitialized && app) {
        // Sử dụng react-native-ml-kit để nhận dạng văn bản
        try {
          const result = await TextRecognition.recognize(localPath);
          
          if (result && result.text) {
            setRecognizedText(result.text);
          } else {
            setRecognizedText('Không nhận dạng được văn bản từ ảnh này. Hãy thử ảnh khác có văn bản rõ ràng hơn.');
          }
          
        } catch (mlError: any) {
          console.error('ML API error:', mlError);
          
          // Fallback: Hiển thị thông tin lỗi chi tiết
          setRecognizedText(
            'Đã nhận ảnh thành công nhưng gặp lỗi khi gọi API nhận dạng văn bản!\n\n' +
            'Thông tin lỗi:\n' +
            `- Lỗi: ${mlError.message || 'Unknown error'}\n\n` +
            'Để nhận dạng văn bản thực tế:\n' +
            '1. Đảm bảo đã cài đặt react-native-ml-kit đúng cách\n' +
            '2. Sử dụng Expo Development Build thay vì Expo Go\n' +
            '3. Kiểm tra tài liệu tại https://github.com/a7medev/react-native-ml-kit\n\n' +
            'Hiện tại API có thể chưa được cấu hình đầy đủ.'
          );
        }
      } else {
        // Firebase chưa được cấu hình
        setRecognizedText(
          'Firebase chưa được cấu hình đầy đủ.\n\n' +
          'Để sử dụng Firebase ML thực tế:\n' +
          '1. Cấu hình Firebase project trong Firebase Console\n' +
          '2. Cập nhật config/firebase.ts với thông tin thực tế\n' +
          '3. Bật ML API trong Firebase Console\n' +
          '4. Sử dụng @react-native-firebase/ml (cần Expo Development Build)\n\n' +
          'Hiện tại đang sử dụng mock data để demo UI.'
        );
      }
      
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Error recognizing text:', error);
      Alert.alert('Lỗi', 'Không thể nhận dạng văn bản từ ảnh');
      setIsProcessing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Machine Learning</Text>
        <Text style={styles.subtitle}>Nhận dạng văn bản từ ảnh với Firebase</Text>
        
        {/* Firebase Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{firebaseStatus}</Text>
        </View>
        
        {/* Hiển thị ảnh đã chọn */}
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => {
                setSelectedImage(null);
                setImagePath('');
                setRecognizedText('');
              }}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons để chọn ảnh */}
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Text style={styles.imageButtonText}>📷 Chụp ảnh</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>🖼️ Chọn ảnh</Text>
          </TouchableOpacity>
        </View>

        {/* Input đường dẫn ảnh */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hoặc nhập đường dẫn ảnh:</Text>
          <TextInput
            style={styles.input}
            value={imagePath}
            onChangeText={handleImagePathChange}
            placeholder="Nhập đường dẫn ảnh hoặc URL..."
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, (isProcessing || !imagePath) && styles.buttonDisabled]}
          onPress={() => recognizeTextFromImage(imagePath)}
          disabled={isProcessing || !imagePath}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Đang xử lý...' : 'Nhận dạng văn bản với Firebase'}
          </Text>
        </TouchableOpacity>

        {recognizedText ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Kết quả nhận dạng:</Text>
            <Text style={styles.resultText}>{recognizedText}</Text>
          </View>
        ) : null}
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  statusText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: 80,
    backgroundColor: '#FF3B30',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
