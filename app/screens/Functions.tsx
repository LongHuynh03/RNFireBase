import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const resolveEmulatorHost = () => {
  if (Platform.OS === 'android') return '10.0.2.2';
  return '127.0.0.1';
};

const projectId = 'rn-test-3a6ca';
const region = 'us-central1';

export default function FunctionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const host = resolveEmulatorHost();
      const url = `http://${host}:5001/${projectId}/${region}/processPayment`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'sp01', amount: 50000 }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      const data = await response.json();
      Alert.alert('Kết quả', (data as any).message ?? 'Thanh toán thành công');
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Functions</Text>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Mua sản phẩm A - 50.000đ</Text>
          <Button title={loading ? "Đang xử lý..." : "Thanh toán"} onPress={handlePayment} />
        </View>
        
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