import { firebase, getInstallations } from '@react-native-firebase/installations';
import { useRouter } from 'expo-router';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const installations = getInstallations(firebase.app());

export default function InstallationsScreen() {
  const router = useRouter();
  const saveFid = async () => {
    try {
      const fid = await installations.getId();
      Alert.alert("FID của thiết bị:", fid);
      console.log("FID của thiết bị:", fid);
    } catch (err) {
      console.log("Lỗi lấy FID:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Installations</Text>
        <Text style={styles.subtitle}>Trang về Installations</Text>
        <Button title="Lưu FID" onPress={saveFid} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});