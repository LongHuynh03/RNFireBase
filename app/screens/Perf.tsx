import perf from '@react-native-firebase/perf';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PerfScreen() {
  const router = useRouter();

  async function getRequest(url: string) {
    // Define the network metric
    const metric = await perf().newHttpMetric(url, 'GET');
  
    // Define meta details
    metric.putAttribute('user', 'abcd');
  
    // Start the metric
    await metric.start();
  
    // Perform a HTTP request and provide response information
    const response = await fetch(url);
    metric.setHttpResponseCode(response.status);
    metric.setResponseContentType(response.headers.get('Content-Type'));
    metric.setResponsePayloadSize(Number(response.headers.get('Content-Length')));
  
    // Stop the metric
    await metric.stop();
  
    return response.json();
  }

  useEffect(() => {
    getRequest('https://jsonplaceholder.typicode.com/todos/5').then(json => {
      console.log(json);
    });
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Performance Monitoring</Text>
        <Text style={styles.subtitle}>Kiểm tra lại ở Performance Monitoring trong Firebase Console</Text>
        
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