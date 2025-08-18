import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f5f5f5', dark: '#1a1a1a' }}
      headerImage={
        <Image
          source={require('../../assets/images/react-logo.png')}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Chào mừng!</Text>
        <Text style={styles.subtitle}>Chọn chức năng bạn muốn sử dụng:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/functions')}
          >
            <Text style={styles.buttonText}>Functions (Pricing)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/in-app-messaging')}
          >
            <Text style={styles.buttonText}>In-App Messaging</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/installations')}
          >
            <Text style={styles.buttonText}>Installations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/messaging')}
          >
            <Text style={styles.buttonText}>Messaging</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/ml')}
          >
            <Text style={styles.buttonText}>Machine Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/perf')}
          >
            <Text style={[styles.buttonText, { fontSize: 13 }]}>Performance Monitoring</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/remote-config')}
          >
            <Text style={styles.buttonText}>Remote Config</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/storage')}
          >
            <Text style={styles.buttonText}>Storage (Pricing)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ParallaxScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
