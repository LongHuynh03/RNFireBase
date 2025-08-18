import remoteConfig from "@react-native-firebase/remote-config";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RemoteConfigScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        await remoteConfig().setDefaults({
          theme: 'default',
        });

        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
  
        const fetchedRemotely = await remoteConfig().fetchAndActivate();
  
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, using cache/defaults.',
          );
        }
  
        const allValues = remoteConfig().getAll();
        Object.keys(allValues).forEach(key => {
          console.log(`Param: ${key} = ${allValues[key].asString()}`);
        });
        updateValues();
      } catch (err) {
        console.error('Remote Config error:', err);
      }
    };
  
    initRemoteConfig();
  }, []);

  const updateValues = () => {
    const theme = remoteConfig().getValue("theme").asString();
    setTheme(theme);
  };

  const backgroundColor = theme === "dark" ? "#000" : "#fff";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Remote Config</Text>
        <Text>Giá trị: {theme}</Text>
        <Text style={styles.subtitle}>Trang về Remote Config</Text>
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
