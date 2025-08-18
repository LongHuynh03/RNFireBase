# 🔥 Hướng dẫn cấu hình Firebase thực tế

## 📋 Mục lục
1. [Tạo Firebase Project](#1-tạo-firebase-project)
2. [Cấu hình ứng dụng](#2-cấu-hình-ứng-dụng)
3. [Cập nhật code](#3-cập-nhật-code)
4. [Bật ML API](#4-bật-ml-api)
5. [Test ứng dụng](#5-test-ứng-dụng)

---

## 1. 🚀 Tạo Firebase Project

### 1.1 Truy cập Firebase Console
- Mở trình duyệt và truy cập: https://console.firebase.google.com/
- Đăng nhập bằng Google account

### 1.2 Tạo project mới
- Click **"Create a project"** hoặc **"Tạo dự án"**
- Đặt tên project (ví dụ: "my-firebase-app")
- Chọn có/không bật Google Analytics (khuyến nghị bật)
- Click **"Create project"**

### 1.3 Chờ project được tạo
- Firebase sẽ tạo project và cài đặt các service cơ bản
- Click **"Continue"** khi hoàn thành

---

## 2. ⚙️ Cấu hình ứng dụng

### 2.1 Thêm ứng dụng Web
- Trong Firebase Console, click biểu tượng **"</>"** (Web app)
- Đặt tên app (ví dụ: "my-react-native-app")
- Click **"Register app"**

### 2.2 Copy config object
Sau khi đăng ký, bạn sẽ thấy config object như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};
```

**⚠️ Lưu ý**: Đây là thông tin nhạy cảm, không chia sẻ công khai!

---

## 3. 📝 Cập nhật code

### 3.1 Cập nhật file config/firebase.ts
Thay thế các giá trị trong file `config/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Thay bằng apiKey thực tế
  authDomain: "my-project.firebaseapp.com", // Thay bằng authDomain thực tế
  projectId: "my-project", // Thay bằng projectId thực tế
  storageBucket: "my-project.appspot.com", // Thay bằng storageBucket thực tế
  messagingSenderId: "123456789", // Thay bằng messagingSenderId thực tế
  appId: "1:123456789:web:abcdef123456789" // Thay bằng appId thực tế
};
```

### 3.2 Cách lấy thông tin config
1. **apiKey**: Copy từ Firebase Console > Project Settings > General > Web API Key
2. **authDomain**: Tự động tạo theo format: `project-id.firebaseapp.com`
3. **projectId**: Tên project bạn đã tạo
4. **storageBucket**: Tự động tạo theo format: `project-id.appspot.com`
5. **messagingSenderId**: Số ID trong Firebase Console
6. **appId**: ID ứng dụng trong Firebase Console

---

## 4. 🔧 Bật ML API

### 4.1 Bật ML Kit trong Firebase Console
- Vào **Firebase Console** > **Project Overview**
- Click **"ML Kit"** trong menu bên trái
- Bật **"Text Recognition"** (Nhận dạng văn bản)

### 4.2 Cài đặt React Native Firebase ML (Tùy chọn)
Nếu muốn sử dụng Firebase ML native:

```bash
npm install @react-native-firebase/ml
```

**⚠️ Lưu ý**: Cần Expo Development Build, không hoạt động với Expo Go!

---

## 5. 🧪 Test ứng dụng

### 5.1 Khởi động ứng dụng
```bash
npm start
# hoặc
expo start
```

### 5.2 Kiểm tra Firebase Status
- Mở trang ML trong ứng dụng
- Xem Firebase Status ở đầu trang
- Nếu hiển thị ✅ = Firebase đã được cấu hình thành công
- Nếu hiển thị ⚠️ = Firebase chưa được cấu hình đầy đủ

### 5.3 Test chức năng
1. **Chụp ảnh**: Nhấn "📷 Chụp ảnh"
2. **Chọn ảnh**: Nhấn "🖼️ Chọn ảnh"
3. **Nhận dạng**: Nhấn "Nhận dạng văn bản với Firebase"

---

## 🚨 Xử lý lỗi thường gặp

### Lỗi 1: "Firebase config chưa được cấu hình đầy đủ"
**Nguyên nhân**: Thiếu thông tin trong config
**Giải pháp**: Kiểm tra và cập nhật đầy đủ 6 trường trong firebaseConfig

### Lỗi 2: "Firebase initialization failed"
**Nguyên nhân**: Config sai hoặc network issue
**Giải pháp**: 
- Kiểm tra lại config
- Kiểm tra kết nối internet
- Xem console log để debug

### Lỗi 3: "ML API not available"
**Nguyên nhân**: Chưa bật ML API trong Firebase Console
**Giải pháp**: Bật ML Kit > Text Recognition trong Firebase Console

---

## 📚 Tài liệu tham khảo

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase ML Kit Documentation](https://firebase.google.com/docs/ml-kit)
- [React Native Firebase](https://rnfirebase.io/)
- [Expo Development Build](https://docs.expo.dev/develop/development-builds/introduction/)

---

## 🎯 Bước tiếp theo

Sau khi cấu hình Firebase thành công:
1. **Tích hợp Authentication** để đăng nhập/đăng ký
2. **Sử dụng Firestore** để lưu trữ dữ liệu
3. **Tích hợp Storage** để upload ảnh
4. **Sử dụng ML Kit** để nhận dạng văn bản thực tế

**Chúc bạn thành công! 🚀**
