from rest_framework import serializers
from rest_framework.serializers import *
from managements.models import *

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)
    avatar_url = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "password", "confirm_password", "avatar_url",
            "first_name", "last_name", "email", "role", "role_name"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_avatar_url(self, obj):
        if obj.avatar and hasattr(obj.avatar, 'url'):
            return obj.avatar.url
        return None

    def get_role_name(self, obj):
        role_map = {0: "Admin", 1: "Exerciser", 2: "Coach"}
        return role_map.get(obj.role)

    def validate(self, attrs):
        # Nếu có password thì bắt buộc phải có confirm_password và phải khớp
        if "password" in attrs or "confirm_password" in attrs:
            if attrs.get("password") != attrs.get("confirm_password"):
                raise serializers.ValidationError(
                    {"password": "Mật khẩu xác nhận không khớp."}
                )
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password", None)
        password = validated_data.pop("password", None)

        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.role = validated_data.get("role", 0)
        user.save()
        return user

    def update(self, instance, validated_data):
        validated_data.pop("confirm_password", None)
        password = validated_data.pop("password", None)
        avatar = validated_data.get("avatar", None)

        if avatar:
            instance.avatar = avatar

        # Cập nhật các field còn lại
        for attr, value in validated_data.items():
            if attr != "avatar":  # avatar đã gán
                setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

class UserReadSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    def get_avatar_url(self, user):
        if user.avatar and hasattr(user.avatar, 'url'):
            return user.avatar.url
        return None

    def get_role_name(self, user):
        return user.get_role_display()

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "avatar_url", "role", "role_name"]

class ChangePasswordSerializer(serializers.Serializer):
    current_password = CharField(write_only=True, required=True)
    new_password = CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu hiện tại không đúng.")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Mật khẩu mới và mật khẩu xác nhận không khớp.")
        return attrs

class ActivitySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url  # Cloudinary đã là full URL
        return None

    class Meta:
        model = Activity
        fields = ['id', 'name', 'description', 'calories_burned', 'image_url']

class ActivityStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['date', 'calories_burned', 'time']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    activities = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Activity.objects.all()
    )

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'user', 'name', 'date', 'activities', 'description', 'sets', 'reps']


    def create(self, validated_data):
        if 'name' not in validated_data:
            validated_data['name'] = f'Kế hoạch {validated_data.get("date")}'
        return super().create(validated_data)



class MealPlanSerializer(serializers.ModelSerializer):
    # Sử dụng UserReadSerializer
    user = UserReadSerializer(read_only=True)

    # Thêm trường image_url
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'date', 'description', 'calories_intake', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            # build_absolute_uri trả về URL đầy đủ
            return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserGoalSerializer(serializers.ModelSerializer):
    # Đã sửa: Sử dụng UserReadSerializer
    user = UserReadSerializer(read_only=True)
    class Meta:
        model = UserGoal
        fields = ['id', 'user', 'goal_type', 'target_weight', 'target_date', 'description']
        read_only_fields = ['user']

class CoachProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = CoachProfile
        fields = ['id', 'user', 'bio', 'specialties', 'years_of_experience', 'certifications']

class HealthRecordSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = HealthRecord
        fields = ['id', 'user', 'bmi', 'water_intake', 'steps', 'heart_rate', 'height', 'weight', 'date']
        read_only_fields = ['bmi']

    def create(self, validated_data):
        if validated_data is None:
            validated_data = {}
        height = validated_data.get('height')
        weight = validated_data.get('weight')
        if height and weight and height > 0:
            validated_data['bmi'] = weight / ((height / 100) ** 2)
        else:
            validated_data['bmi'] = None
        return super().create(validated_data)


class HealthDiarySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = HealthDiary
        fields = ['id', 'user', 'date', 'content', 'feeling']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserReadSerializer(read_only=True)
    receiver = UserReadSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp', 'is_read']

# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']

class UserConnectionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    coach = UserSerializer()
    class Meta:
        model = UserConnection
        fields = ['id', 'user', 'coach', 'status']
