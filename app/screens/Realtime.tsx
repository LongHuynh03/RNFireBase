import database, { firebase } from '@react-native-firebase/database';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const reference = firebase
  .app()
  .database('https://rn-test-3a6ca-default-rtdb.asia-southeast1.firebasedatabase.app/')
  .ref('/users');

export default function Realtime() {

  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; createdAt?: number }>>([]);

  useEffect(() => {
    reference.on('value', (snapshot) => {
      const val = snapshot.val() || {};
      const list: Array<{ id: string; name: string; email: string; createdAt?: number }> = Object.keys(val).map((id) => ({
        id,
        name: val[id]?.name ?? '',
        email: val[id]?.email ?? '',
        createdAt: val[id]?.createdAt,
      }));
      list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setUsers(list);
    });
    return () => {
      reference.off('value');
    };
  }, []);

  const renderUserItem = ({ item }: { item: { id: string; name: string; email: string; createdAt?: number } }) => {
    const initials = (item.name || item.email || '?').trim().charAt(0).toUpperCase();
    const timeText = item.createdAt ? new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '';
    return (
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'No name'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          {!!timeText && <Text style={styles.userTime}>{timeText}</Text>}
        </View>
      </View>
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email và Mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const snapshot = await reference
        .orderByChild('email')
        .equalTo(email.trim())
        .once('value');

      if (!snapshot.exists()) {
        Alert.alert('Lỗi', 'Email không tồn tại');
        return;
      }

      let isMatch = false;
      snapshot.forEach((child) => {
        const user = child.val();
        if (user && user.password === password) {
          isMatch = true;
          return true; // stop iteration
        }
        return undefined;
      });

      if (!isMatch) {
        Alert.alert('Lỗi', 'Mật khẩu không đúng');
        return;
      }

      Alert.alert('Thành công', 'Đăng nhập thành công');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối Firebase');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Tên, Email và Mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();

      const existsSnap = await reference
        .orderByChild('email')
        .equalTo(trimmedEmail)
        .once('value');

      if (existsSnap.exists()) {
        Alert.alert('Lỗi', 'Email đã tồn tại');
        return;
      }

      const newUserRef = reference.push();
      await newUserRef.set({
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        createdAt: database.ServerValue.TIMESTAMP,
      });

      Alert.alert('Thành công', 'Tạo tài khoản thành công. Vui lòng đăng nhập.');
      setIsLogin(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Realtime</Text>
          <Text style={styles.subtitle}>Đăng ký/Đăng nhập và xem danh sách người dùng theo thời gian thực</Text>

          <View style={styles.authCard}>
            <Text style={styles.sectionTitle}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Text>

            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleButton, isLogin && styles.toggleButtonActive]} onPress={() => setIsLogin(true)}>
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]} onPress={() => setIsLogin(false)}>
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Tên"
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.switch} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Chưa có tài khoản? Nhấn để Đăng ký' : 'Đã có tài khoản? Nhấn để Đăng nhập'}
            </Text>
          </View>

          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Danh sách tài khoản</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              ListEmptyComponent={<Text style={styles.listEmptyText}>Chưa có người dùng</Text>}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    color: '#e2e8f0',
    backgroundColor: '#0b1224',
  },
  switch: {
    marginTop: 12,
    textAlign: 'center',
    color: '#60a5fa'
  },
  backButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authCard: {
    backgroundColor: '#0b1224',
    borderColor: '#1f2a44',
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  listCard: {
    backgroundColor: '#0b1224',
    borderColor: '#1f2a44',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#0f1a33',
    borderRadius: 10,
    padding: 4,
    gap: 6,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#1d4ed8',
  },
  toggleText: {
    color: '#93c5fd',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  listTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  listEmptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 12,
  },
  userRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  userEmail: {
    color: '#93c5fd',
  },
  userTime: {
    color: '#94a3b8',
    fontSize: 12,
  },
});