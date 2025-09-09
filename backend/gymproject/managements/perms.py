from rest_framework import permissions
from .models import Role

class OwnerPermission(permissions.IsAuthenticated):
    """Chỉ cho phép owner thao tác trên object"""
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, request.user.__class__):
            return obj == request.user
        return hasattr(obj, 'user') and obj.user == request.user


class AdminOrCoachPermission(permissions.BasePermission):
    """Admin hoặc Coach được phép truy cập mọi thứ"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in [Role.Admin, Role.Coach]


class ExerciserPermission(permissions.BasePermission):
    """Exerciser chỉ được thao tác với dữ liệu của mình"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Role.Exerciser


class AdminPermission(permissions.BasePermission):
    """Chỉ Admin"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Role.Admin


class CoachPermission(permissions.BasePermission):
    """Chỉ Coach"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Role.Coach
