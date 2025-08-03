Đây là ứng dụng quản lý sức khỏe cá nhân gồm backend Django và frontend React Native (Expo)
Cho phép người dùng theo dõi chỉ số sức khỏe, lịch sử khám bệnh, và cập nhật thông tin cá nhân

# HealthManage (Backend) bằng Django
```bash
# Tạo môi trường ảo
python -m venv venv
venv\Scripts\activate   # Windows
# hoặc
source venv/bin/activate  # macOS/Linux

# Cài đặt Django và các thư viện
pip install django
pip install pymysql
pip install cloudinary
pip install Pillow
pip install django-ckeditor
pip install djangorestframework

# Tạo project và app
django-admin startproject healthManage
django-admin startapp managements

# Migrate DB
python manage.py makemigrations managements
python manage.py migrate

# Tạo tài khoản admin
python manage.py createsuperuser

# Chạy server
python manage.py runserver

# Ghi lại thư viện đã cài
pip freeze > requirements.txt
```

# HealthManage (Fontend) bằng React Native
```bash
# Cài Expo CLI (nếu chưa có)
npm install -g expo-cli

# Tạo app Expo
npx create-expo-app reactmobileapp
cd reactmobileapp

# Cài đặt thư viện phụ trợ
npm install axios
npm install react-navigation
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install react-native-vector-icons
npm install react-native-paper
npm install dotenv

# Khởi động dự án
npx expo start

