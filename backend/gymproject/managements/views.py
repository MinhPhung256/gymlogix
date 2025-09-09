from rest_framework import viewsets, generics, status
from .serializers import *
from managements import paginators
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .paginators import Pagination
from .perms import *
from rest_framework.parsers import MultiPartParser, JSONParser
from datetime import timedelta


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    pagination_class = Pagination
    parser_classes = [JSONParser, MultiPartParser]

    def get_permissions(self):
        if self.action in ["change_password", "update_info", "get_current_user"]:
            return [IsAuthenticated(), OwnerPermission()]
        elif self.action == "create":
            return [AllowAny()]
        elif self.action == "get_all_users":
            return [IsAuthenticated(), AdminOrCoachPermission()]
        return [IsAuthenticated()]

    @action(methods=['get'], url_path='all-users', detail=False)
    def get_all_users(self, request):
        self.check_permissions(request)
        queryset = User.objects.filter(is_active=True)
        pagination_class = paginators.Pagination()
        paginated_queryset = pagination_class.paginate_queryset(queryset, request, view=self)
        serializer = UserSerializer(paginated_queryset, many=True)
        return pagination_class.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='current', detail=False)
    def get_current_user(self, request):
        user = request.user
        self.check_object_permissions(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='change-password', detail=False)
    def change_password(self, request):
        user = request.user
        self.check_object_permissions(request, user)

        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        # Sử dụng raise_exception=True để lỗi validate trả về 400, không crash server
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])

        return Response({"message": "Mật khẩu đã được thay đổi"}, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update-info', detail=False)
    def update_info(self, request):
        user = request.user
        data = request.data.copy()
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.filter(active=True)
    serializer_class = ActivitySerializer
    parser_classes = [JSONParser, MultiPartParser]

    def get_permissions(self):
        if self.request.method in ['GET']:
            return [AllowAny()]
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), AdminOrCoachPermission()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)

        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        calories_min = self.request.query_params.get('calories_min')
        calories_max = self.request.query_params.get('calories_max')
        if calories_min:
            queryset = queryset.filter(calories_burned__gte=calories_min)
        if calories_max:
            queryset = queryset.filter(calories_burned__lte=calories_max)

        return queryset

class WeeklyStatisticsAPIView(generics.ListAPIView):
    serializer_class = ActivityStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        today = timezone.localdate()
        start_week = today - timedelta(days=today.weekday())  # thứ 2
        end_week = start_week + timedelta(days=6)  # CN
        return Activity.objects.filter(user=user, date__range=[start_week, end_week]).order_by('date')

class WorkoutPlanViewSet(viewsets.ModelViewSet):
    queryset = WorkoutPlan.objects.filter(active=True)
    serializer_class = WorkoutPlanSerializer

    def get_permissions(self):
        if self.action in ["create_plan", "user_plans", "weekly_summary"]:
            return [IsAuthenticated()]
        elif self.action in ["plans_by_user"]:
            return [IsAuthenticated(), AdminOrCoachPermission()]
        return [IsAuthenticated()]

    @action(methods=['post'], url_path='create-plan', detail=False)
    def create_plan(self, request):
        serializer = WorkoutPlanSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # user tự động lấy từ HiddenField
            return Response({"message": "Kế hoạch tập luyện đã được tạo."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='my-plans', detail=False)
    def user_plans(self, request):
        plans = WorkoutPlan.objects.filter(user=request.user)
        serializer = WorkoutPlanSerializer(plans, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='weekly-summary', detail=False)
    def weekly_summary(self, request):
        user = request.user
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        weekly_plans = WorkoutPlan.objects.filter(user=user, date__range=(start_of_week, end_of_week))
        total_time = sum(
            [plan.sets * plan.reps * plan.activities.count() for plan in weekly_plans if plan.sets and plan.reps])

        serializer = WorkoutPlanSerializer(weekly_plans, many=True)
        return Response({
            "total_sessions": len(weekly_plans),
            "estimated_total_exercise_units": total_time,
            "plans": serializer.data
        })

    @action(methods=['get'], url_path='plans-by-user/(?P<user_id>[^/.]+)', detail=False)
    def plans_by_user(self, request, user_id=None):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"message": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        plans = WorkoutPlan.objects.filter(user=user)
        serializer = WorkoutPlanSerializer(plans, many=True)
        return Response(serializer.data)


class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.filter(active=True)
    serializer_class = MealPlanSerializer

    def get_permissions(self):
        if self.action in ['create_meal_plan', 'mealplans_by_goal']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    @action(methods=['post'], url_path='create-meal-plan', detail=False)
    def create_meal_plan(self, request):
        serializer = MealPlanSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Thực đơn dinh dưỡng đã được tạo."}, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='mealplans-by-goal/(?P<goal>[^/.]+)', detail=False)
    def mealplans_by_goal(self, request, goal=None):
        plans = MealPlan.objects.filter(goal=goal, active=True)
        serializer = MealPlanSerializer(plans, many=True, context={'request': request})
        return Response(serializer.data)

class HealthRecordViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):
    serializer_class = HealthRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role in [Role.Admin, Role.Coach]:
            return HealthRecord.objects.filter(active=True)
        return HealthRecord.objects.filter(user=self.request.user, active=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class HealthDiaryViewSet(viewsets.ModelViewSet):
    queryset = HealthDiary.objects.all()
    serializer_class = HealthDiarySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated(), AdminOrCoachPermission()]
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), OwnerPermission()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role in [Role.Admin, Role.Coach]:
            return HealthDiary.objects.filter(active=True)
        return HealthDiary.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False)
    def my_diaries(self, request):
        diaries = HealthDiary.objects.filter(user=request.user).order_by('-date')
        serializer = self.get_serializer(diaries, many=True)
        return Response(serializer.data)


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()  # bỏ active=True vì model không có field active
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['post'], url_path='send-message', detail=False)
    def send_message(self, request):
        user = request.user
        receiver_id = request.data.get('receiver_id')
        message = request.data.get('message')

        receiver = User.objects.filter(id=receiver_id).first()
        if not receiver:
            return Response({"message": "Người nhận không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

        chat_message = ChatMessage(sender=user, receiver=receiver, message=message)
        chat_message.save()

        return Response({"message": "Tin nhắn đã được gửi."}, status=status.HTTP_201_CREATED)


class UserGoalViewSet(viewsets.ModelViewSet):
    queryset = UserGoal.objects.filter(active=True)
    serializer_class = UserGoalSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserConnectionViewSet(viewsets.ModelViewSet):
    queryset = UserConnection.objects.filter(active=True)
    serializer_class = UserConnectionSerializer
    permission_classes = [IsAuthenticated]
