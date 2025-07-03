import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InformationCircleIcon, EyeIcon, EyeSlashIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface SecuritySettingsTabProps {
  formData: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (show: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({
  formData,
  handleChange,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <ShieldCheckIcon className="w-6 h-6 mr-3 text-red-500" />
        {t('profile.security', 'Security Settings')}
      </h3>

      {/* Password Change Section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
          {t('profile.changePassword', 'Change Password')}
        </h4>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded text-blue-800 dark:text-blue-200">
          <p className="text-sm">
            <InformationCircleIcon className="w-4 h-4 inline mr-1" />
            {t('profile.passwordChangeOptional', 'Leave password fields empty to update other settings without changing your password.')}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.currentPassword', 'Current Password')}
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword || ''}
                onChange={handleChange}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.enterCurrentPassword', 'Enter your current password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.newPassword', 'New Password')}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword || ''}
                onChange={handleChange}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.enterNewPassword', 'Enter your new password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.confirmPassword', 'Confirm New Password')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.confirmNewPassword', 'Confirm your new password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('profile.passwordChangeNote', 'Password changes will be saved when you click "Save Changes" at the bottom of the form.')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;