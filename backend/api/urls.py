from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ConsultantViewSet, ScanUploadView, PaymentInitiateView,
    PaymentCallbackView, PaymentReleaseEscrowView, HotspotListView,
    RegisterView, AvatarUploadView, UserProfileUpdateView, AgricultureAdviserView,
    DeepseekAdviserView, GoogleAuthView
)
router = DefaultRouter()
router.register(r'consultants', ConsultantViewSet, basename='consultant')

urlpatterns = [
    path('', include(router.urls)),
    path('upload-scan/', ScanUploadView.as_view(), name='upload_scan'),
    path('payment/initiate/', PaymentInitiateView.as_view(), name='payment_initiate'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment_callback'),
    path('payment/release-escrow/', PaymentReleaseEscrowView.as_view(), name='payment_release_escrow'),
    path('hotspots/', HotspotListView.as_view(), name='hotspots'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/upload-avatar/', AvatarUploadView.as_view(), name='upload_avatar'),
    path('auth/profile/', UserProfileUpdateView.as_view(), name='update_profile'),
    path('adviser/', AgricultureAdviserView.as_view(), name='agriculture_adviser'),
    path('deepseek/', DeepseekAdviserView.as_view(), name='deepseek_adviser'),
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),
]
