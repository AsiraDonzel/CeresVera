from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ConsultantViewSet, ScanUploadView, ScanListView, PaymentInitiateView,
    PaymentCallbackView, PaymentReleaseEscrowView, HotspotListView,
    RegisterView, AvatarUploadView, UserProfileUpdateView, AgricultureAdviserView,
    DeepseekAdviserView, GoogleAuthView, CustomTokenObtainPairView,
    PasswordResetRequestView, PasswordResetVerifyView, PasswordResetConfirmView,
    AdminExpertPendingView, AdminExpertReviewView, NotificationListView,
    MarketplaceExpertListView, ConversationViewSet, MessageCreateView,
    expert_registration_view, marketplace_view
)
router = DefaultRouter()
router.register(r'consultants', ConsultantViewSet, basename='consultant')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/conversations/', ConversationViewSet.as_view({'get': 'list', 'post': 'create'}), name='conversations'),
    path('chat/conversations/<int:pk>/', ConversationViewSet.as_view({'get': 'retrieve'}), name='conversation-detail'),
    path('chat/messages/', MessageCreateView.as_view(), name='messages'),
    path('upload-scan/', ScanUploadView.as_view(), name='upload_scan'),
    path('scans/', ScanListView.as_view(), name='scan_list'),
    path('payment/initiate/', PaymentInitiateView.as_view(), name='payment_initiate'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment_callback'),
    path('payment/release-escrow/', PaymentReleaseEscrowView.as_view(), name='payment_release_escrow'),
    path('hotspots/', HotspotListView.as_view(), name='hotspots'),
    path('marketplace/experts/', MarketplaceExpertListView.as_view(), name='marketplace_experts'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/upload-avatar/', AvatarUploadView.as_view(), name='upload_avatar'),
    path('auth/profile/', UserProfileUpdateView.as_view(), name='update_profile'),
    path('adviser/', AgricultureAdviserView.as_view(), name='agriculture_adviser'),
    path('deepseek/', DeepseekAdviserView.as_view(), name='deepseek_adviser'),
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),
    path('auth/password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset-verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('admin/experts/pending/', AdminExpertPendingView.as_view(), name='admin_expert_pending'),
    path('admin/experts/review/<int:profile_id>/', AdminExpertReviewView.as_view(), name='admin_expert_review'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    # Hackathon Specialized Paths
    path('expert/register-force/', expert_registration_view, name='expert_register_force'),
    path('expert/marketplace-html/', marketplace_view, name='expert_marketplace_html'),
]
