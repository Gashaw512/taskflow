import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../Shared/ToastContext';

// Import the componentized tabs
import GeneralSettingsTab from './GeneralSettingsTab';
import SecuritySettingsTab from './SecuritySettingsTab';
import ProductivitySettingsTab from './ProductivitySettingsTab';
import TelegramSettingsTab from './TelegramSettingsTab';
import AISettingsTab from './AISettingsTab';

interface ProfileSettingsProps {
  currentUser: { id: number; email: string };
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

interface Profile {
  id: number;
  email: string;
  appearance: 'light' | 'dark';
  language: string;
  timezone: string;
  avatar_image: string | null;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  task_summary_enabled: boolean;
  task_summary_frequency: string;
  task_intelligence_enabled: boolean;
  auto_suggest_next_actions_enabled: boolean;
  productivity_assistant_enabled: boolean;
  next_task_suggestion_enabled: boolean;
  pomodoro_enabled: boolean;
}

interface TelegramBotInfo {
  username: string;
  polling_status: any;
  chat_url: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();
  const { showSuccessToast, showErrorToast } = useToast();

  const [activeTab, setActiveTab] = useState('general');

  // State to manage password field visibility in the Security tab
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for the user's profile data
  const [profile, setProfile] = useState<Profile | null>(null);
  // State for form data, including password fields for submission
  const [formData, setFormData] = useState<Partial<Profile & { currentPassword: string, newPassword: string, confirmPassword: string }>>({
    appearance: isDarkMode ? 'dark' : 'light',
    language: 'en',
    timezone: 'UTC',
    avatar_image: '',
    telegram_bot_token: '',
    task_intelligence_enabled: true,
    task_summary_enabled: false,
    task_summary_frequency: 'daily',
    auto_suggest_next_actions_enabled: true,
    productivity_assistant_enabled: true,
    next_task_suggestion_enabled: true,
    pomodoro_enabled: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [updateKey, setUpdateKey] = useState(0); // Used to force re-render, primarily for language changes
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [telegramSetupStatus, setTelegramSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [telegramBotInfo, setTelegramBotInfo] = useState<TelegramBotInfo | null>(null);

  // Callback to force a re-render, primarily used after language changes to refresh localized content
  const forceUpdate = useCallback(() => {
    setUpdateKey(prevKey => prevKey + 1);
  }, []);

  // Password validation logic
  const validatePasswordForm = (): { valid: boolean, errors: { [key: string]: string } } => {
    const errors: { [key: string]: string } = {};

    // Only validate if user is attempting to change password (any password field is filled)
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = t('profile.currentPasswordRequired', 'Current password is required');
      }

      if (!formData.newPassword) {
        errors.newPassword = t('profile.newPasswordRequired', 'New password is required');
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = t('profile.passwordTooShort', 'Password must be at least 6 characters');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = t('profile.passwordMismatch', 'Passwords do not match');
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  };

  // Generic handler for form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles language change, updates i18n, document lang, and potentially reloads resources
  const handleLanguageChange = async (value: string) => {
    try {
      setIsChangingLanguage(true);
      await i18n.changeLanguage(value);
      document.documentElement.lang = value;

      // Check if resources are already loaded for the new language
      const resources = i18n.getResourceBundle(value, 'translation');
      if (!resources || Object.keys(resources).length === 0) {
        const loadPath = `/locales/${value}/translation.json`;
        try {
          const response = await fetch(loadPath);
          if (response.ok) {
            const data = await response.json();
            i18n.addResourceBundle(value, 'translation', data, true, true);
            // Trigger a hard reload if necessary (e.g., for components not reacting to i18n changes)
            if (window.forceLanguageReload) {
              window.forceLanguageReload(value);
            }
          }
        } catch (err) {
          // Log error but don't block the language change
          console.error('Failed to load language resources:', err);
        }
      }

      // Small delay to allow for i18n updates and potential reloads to take effect
      setTimeout(() => {
        forceUpdate(); // Ensure components re-render with new translations
        // Double-check and force reload if resources are still missing after initial attempts
        const checkAndLoadResources = i18n.getResourceBundle(value, 'translation');
        if (!checkAndLoadResources || Object.keys(checkAndLoadResources).length === 0) {
          if (window.forceLanguageReload) {
            window.forceLanguageReload(value);
          }
        }
        // Final reset of language changing state after a sufficient delay
        setTimeout(() => {
          if (isChangingLanguage) { // Only reset if still in changing state
            setIsChangingLanguage(false);
          }
        }, 800);
      }, 200);
    } catch (error) {
      console.error('Error during language change:', error);
      setIsChangingLanguage(false); // Ensure state is reset even on error
    }
  };

  // Effect to fetch initial profile data and Telegram polling status on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/profile');

        if (!response.ok) {
          throw new Error(t('profile.fetchError', 'Failed to fetch profile data.'));
        }

        const data = await response.json();
        setProfile(data);
        // Initialize formData with fetched data, providing sensible defaults using nullish coalescing
        setFormData({
          appearance: data.appearance || (isDarkMode ? 'dark' : 'light'),
          language: data.language || 'en',
          timezone: data.timezone || 'UTC',
          avatar_image: data.avatar_image || '',
          telegram_bot_token: data.telegram_bot_token || '',
          task_intelligence_enabled: data.task_intelligence_enabled ?? true,
          task_summary_enabled: data.task_summary_enabled ?? false,
          task_summary_frequency: data.task_summary_frequency || 'daily',
          auto_suggest_next_actions_enabled: data.auto_suggest_next_actions_enabled ?? true,
          productivity_assistant_enabled: data.productivity_assistant_enabled ?? true,
          next_task_suggestion_enabled: data.next_task_suggestion_enabled ?? true,
          pomodoro_enabled: data.pomodoro_enabled ?? true,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        if (data.telegram_bot_token) {
          fetchPollingStatus();
        }
      } catch (error) {
        showErrorToast((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPollingStatus = async () => {
      try {
        const response = await fetch('/api/telegram/polling-status');

        if (!response.ok) {
          throw new Error(t('profile.pollingStatusError', 'Failed to fetch polling status.'));
        }

        const data = await response.json();
        setIsPolling(data.running);

        // If token exists but polling is not running, attempt to start it
        if (data.token_exists && !data.running) {
          handleStartPolling();
        }
      } catch (error) {
        console.error('Error fetching polling status:', error);
        // Do not show a toast for this, as it's a background check
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to sync formData.appearance with isDarkMode prop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, appearance: isDarkMode ? 'dark' : 'light' }));
  }, [isDarkMode]);

  // Effect to handle i18n language change events and custom app language change events
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    const handleAppLanguageChanged = () => {
      forceUpdate();
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 300);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    window.addEventListener('app-language-changed', handleAppLanguageChanged as EventListener);

    // Cleanup function for event listeners
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
      window.removeEventListener('app-language-changed', handleAppLanguageChanged as EventListener);
    };
  }, [forceUpdate, i18n]); // Dependencies include forceUpdate and i18n object

  // Handles setting up the Telegram bot with the provided token
  const handleSetupTelegram = async () => {
    setTelegramSetupStatus('loading');
    setTelegramBotInfo(null);

    try {
      if (!formData.telegram_bot_token || !formData.telegram_bot_token.includes(':')) {
        throw new Error(t('profile.invalidTelegramToken', 'Invalid Telegram bot token.'));
      }

      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: formData.telegram_bot_token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.telegramSetupFailed', 'Failed to set up Telegram bot.'));
      }

      const data = await response.json();
      setTelegramSetupStatus('success');
      showSuccessToast(t('profile.telegramSetupSuccess', 'Telegram bot configured successfully!'));

      if (data.bot) {
        setTelegramBotInfo(data.bot);
        setIsPolling(true); // Assume polling starts immediately after setup

        // If polling wasn't running, explicitly start it after a short delay
        if (!data.bot.polling_status?.running) {
          setTimeout(() => {
            handleStartPolling();
          }, 1000);
        }
      }

      const botUsername = data.bot?.username || formData.telegram_bot_token.split(':')[0];
      window.open(`https://t.me/${botUsername}`, '_blank'); // Open bot chat in new tab

    } catch (error) {
      setTelegramSetupStatus('error');
      showErrorToast((error as Error).message);
    }
  };

  // Handles starting the Telegram bot polling
  const handleStartPolling = async () => {
    try {
      const response = await fetch('/api/telegram/start-polling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.startPollingFailed', 'Failed to start polling.'));
      }

      const data = await response.json();
      setIsPolling(true);
      showSuccessToast(t('profile.pollingStarted', 'Polling started successfully.'));

      if (telegramBotInfo) {
        setTelegramBotInfo({
          ...telegramBotInfo,
          polling_status: data.status // Update polling status in bot info
        });
      }
    } catch (error) {
      showErrorToast(t('profile.pollingError', 'Polling failed.'));
    }
  };

  // Handles stopping the Telegram bot polling
  const handleStopPolling = async () => {
    try {
      const response = await fetch('/api/telegram/stop-polling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.stopPollingFailed', 'Failed to stop polling.'));
      }

      const data = await response.json();
      setIsPolling(false);
      showSuccessToast(t('profile.pollingStopped', 'Polling stopped successfully.'));

      if (telegramBotInfo) {
        setTelegramBotInfo({
          ...telegramBotInfo,
          polling_status: data.status // Update polling status in bot info
        });
      }
    } catch (error) {
      showErrorToast(t('profile.pollingError', 'Polling failed.'));
    }
  };

  // Handles the form submission for updating profile settings
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isPasswordChangeAttempt = formData.currentPassword || formData.newPassword || formData.confirmPassword;

    if (isPasswordChangeAttempt) {
      const passwordValidation = validatePasswordForm();
      if (!passwordValidation.valid) {
        showErrorToast(Object.values(passwordValidation.errors)[0]);
        return;
      }
    }

    try {
      const dataToSend = { ...formData };
      // Remove password fields from dataToSend if no password change is intended
      if (!isPasswordChangeAttempt) {
        delete (dataToSend as any).currentPassword; // Type assertion needed as Partial<Profile> doesn't know these keys
        delete (dataToSend as any).newPassword;
        delete (dataToSend as any).confirmPassword;
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include', // Send cookies with the request
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile.');
      }

      const updatedProfile: Profile = await response.json();
      setProfile(updatedProfile);

      // Update formData with the latest profile data, ensuring defaults if undefined
      setFormData(prev => ({
        ...prev,
        appearance: updatedProfile.appearance ?? prev.appearance ?? 'light',
        language: updatedProfile.language ?? prev.language ?? 'en',
        timezone: updatedProfile.timezone ?? prev.timezone ?? 'UTC',
        avatar_image: updatedProfile.avatar_image ?? prev.avatar_image ?? '',
        telegram_bot_token: updatedProfile.telegram_bot_token ?? prev.telegram_bot_token ?? '',
        task_intelligence_enabled: updatedProfile.task_intelligence_enabled ?? prev.task_intelligence_enabled ?? true,
        task_summary_enabled: updatedProfile.task_summary_enabled ?? prev.task_summary_enabled ?? false,
        task_summary_frequency: updatedProfile.task_summary_frequency ?? prev.task_summary_frequency ?? 'daily',
        auto_suggest_next_actions_enabled: updatedProfile.auto_suggest_next_actions_enabled ?? prev.auto_suggest_next_actions_enabled ?? true,
        productivity_assistant_enabled: updatedProfile.productivity_assistant_enabled ?? prev.productivity_assistant_enabled ?? true,
        next_task_suggestion_enabled: updatedProfile.next_task_suggestion_enabled ?? prev.next_task_suggestion_enabled ?? true,
        pomodoro_enabled: updatedProfile.pomodoro_enabled ?? prev.pomodoro_enabled ?? true,
      }));

      // Toggle dark mode if appearance setting changed
      if (updatedProfile.appearance !== (isDarkMode ? 'dark' : 'light') && toggleDarkMode) {
        toggleDarkMode();
      }

      // Change i18n language if it was updated
      if (updatedProfile.language !== i18n.language) {
        await handleLanguageChange(updatedProfile.language);
      }

      // Dispatch custom event if pomodoro setting changed, to inform other parts of the app
      if (updatedProfile.pomodoro_enabled !== undefined) {
        window.dispatchEvent(new CustomEvent('pomodoroSettingChanged', {
          detail: { enabled: updatedProfile.pomodoro_enabled }
        }));
      }

      // Clear password fields after a successful password change attempt
      if (isPasswordChangeAttempt) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      const successMessage = isPasswordChangeAttempt
        ? t('profile.passwordChangeSuccess', 'Password changed successfully!')
        : t('profile.successMessage', 'Profile updated successfully!');
      showSuccessToast(successMessage);
    } catch (err) {
      showErrorToast((err as Error).message);
    }
  };

  // Display loading indicator while profile data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  // Define tabs for navigation and their associated icons
  const tabs = [
    { id: 'general', name: t('profile.tabs.general', 'General'), icon: 'user' },
    { id: 'security', name: t('profile.tabs.security', 'Security'), icon: 'shield' },
    { id: 'productivity', name: t('profile.tabs.productivity', 'Productivity'), icon: 'clock' },
    { id: 'telegram', name: t('profile.tabs.telegram', 'Telegram'), icon: 'chat' },
    { id: 'ai', name: t('profile.tabs.ai', 'AI Features'), icon: 'sparkles' },
  ];

  // Helper function to render tab icons dynamically based on icon type string
  const renderTabIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return <UserIcon className="w-5 h-5" />;
      case 'clock':
        return <ClockIcon className="w-5 h-5" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
      case 'shield':
        return <ShieldCheckIcon className="w-5 h-5" />;
      case 'sparkles':
        return <LightBulbIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6" key={`profile-settings-${updateKey}`}>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        {t('profile.title')}
      </h2>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{renderTabIcon(tab.icon)}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Render active tab component based on activeTab state */}
        {activeTab === 'general' && (
          <GeneralSettingsTab
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettingsTab
            formData={formData}
            handleChange={handleChange}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}

        {activeTab === 'productivity' && (
          <ProductivitySettingsTab
            formData={formData}
            setFormData={setFormData} // Pass setFormData to allow child component to update its specific settings
          />
        )}

        {activeTab === 'telegram' && (
          <TelegramSettingsTab
            formData={formData}
            profile={profile}
            handleChange={handleChange}
            setFormData={setFormData} // Pass setFormData for toggles and frequency changes
            handleSetupTelegram={handleSetupTelegram}
            handleStartPolling={handleStartPolling}
            handleStopPolling={handleStopPolling}
            telegramSetupStatus={telegramSetupStatus}
            telegramBotInfo={telegramBotInfo}
            isPolling={isPolling}
            showSuccessToast={showSuccessToast}
            showErrorToast={showErrorToast}
          />
        )}

        {activeTab === 'ai' && (
          <AISettingsTab
            formData={formData}
            setFormData={setFormData} // Pass setFormData for toggles
          />
        )}

        {/* Save Button */}
        <div className="flex justify-end dark:border-gray-700">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <CheckIcon className="w-5 h-5" />
            <span>{t('profile.saveChanges', 'Save Changes')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;