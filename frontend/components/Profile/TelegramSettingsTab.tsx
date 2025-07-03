import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InformationCircleIcon, CogIcon, ClipboardDocumentListIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TelegramBotInfo {
  username: string;
  polling_status: any;
  chat_url: string;
}

interface TelegramSettingsTabProps {
  formData: {
    telegram_bot_token: string | null;
    task_summary_enabled: boolean;
    task_summary_frequency: string;
  };
  profile: {
    id: number;
    telegram_bot_token: string | null;
    telegram_chat_id: string | null;
  } | null;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>; // More specific type if possible
  handleSetupTelegram: () => Promise<void>;
  handleStartPolling: () => Promise<void>;
  handleStopPolling: () => Promise<void>;
  telegramSetupStatus: 'idle' | 'loading' | 'success' | 'error';
  telegramBotInfo: TelegramBotInfo | null;
  isPolling: boolean;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

const formatFrequency = (frequency: string): string => {
  if (frequency.endsWith('h')) {
    const value = frequency.replace('h', '');
    return `${value} ${parseInt(value) === 1 ? 'hour' : 'hours'}`;
  } else if (frequency === 'daily') {
    return '1 day';
  } else if (frequency === 'weekly') {
    return '1 week';
  } else if (frequency === 'weekdays') {
    return 'Weekdays';
  }
  return frequency;
};

const TelegramSettingsTab: React.FC<TelegramSettingsTabProps> = ({
  formData,
  profile,
  handleChange,
  setFormData,
  handleSetupTelegram,
  handleStartPolling,
  handleStopPolling,
  telegramSetupStatus,
  telegramBotInfo,
  isPolling,
  showSuccessToast,
  showErrorToast,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-300 dark:border-blue-700 mb-8">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-6 flex items-center">
        <ClipboardDocumentListIcon className="w-6 h-6 mr-3 text-blue-500" />
        {t('profile.telegramIntegration', 'Telegram Integration')}
      </h3>

      {/* Bot Setup Subsection */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <CogIcon className="w-5 h-5 mr-2 text-blue-500" />
          {t('profile.botSetup', 'Bot Setup')}
        </h4>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
            <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
            <p>{t('profile.telegramDescription', 'Connect your Tududi account to a Telegram bot to add items to your inbox via Telegram messages.')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('profile.telegramBotToken', 'Telegram Bot Token')}
            </label>
            <input
              type="text"
              name="telegram_bot_token"
              value={formData.telegram_bot_token || ''}
              onChange={handleChange}
              placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('profile.telegramTokenDescription', 'Create a bot with @BotFather on Telegram and paste the token here.')}
            </p>
          </div>

          {profile?.telegram_chat_id && (
            <div className="p-2 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded text-green-800 dark:text-green-200">
              <p className="text-sm">
                {t('profile.telegramConnected', 'Your Telegram account is connected! Send messages to your bot to add items to your Tududi inbox.')}
              </p>
            </div>
          )}


          {telegramBotInfo && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-2">
                {t('profile.botConfigured', 'Bot configured successfully!')}
              </p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold">{t('profile.botUsername', 'Bot Username:')} </span>
                  @{telegramBotInfo.username}
                </p>
                <div className="mt-2">
                  <p className="font-semibold mb-1">{t('profile.pollingStatus', 'Polling Status:')} </p>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isPolling ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{isPolling ? t('profile.pollingActive') : t('profile.pollingInactive')}</span>
                  </div>
                  <p className="text-xs mb-2">
                    {t('profile.pollingNote', 'Polling periodically checks for new messages from Telegram and adds them to your inbox.')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {isPolling ? (
                      <button
                        onClick={handleStopPolling}
                        className="px-3 py-1 bg-red-600 text-white dark:bg-red-700 rounded text-sm hover:bg-red-700 dark:hover:bg-red-800"
                      >
                        {t('profile.stopPolling', 'Stop Polling')}
                      </button>
                    ) : (
                      <button
                        onClick={handleStartPolling}
                        className="px-3 py-1 bg-blue-600 text-white dark:bg-blue-700 rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        {t('profile.startPolling', 'Start Polling')}
                      </button>
                    )}
                    <a
                      href={telegramBotInfo.chat_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600 text-white dark:bg-green-700 rounded text-sm hover:bg-green-700 dark:hover:bg-green-800"
                    >
                      {t('profile.openTelegram', 'Open in Telegram')}
                    </a>
                    <button
                      onClick={async () => {
                        try {
                          const testMessage = prompt('Enter a test message:');
                          if (testMessage) {
                            const response = await fetch(`/api/telegram/test/${profile?.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ text: testMessage })
                            });
                            const result = await response.json();
                            if (result.success) {
                              showSuccessToast(t('profile.testMessageSent', 'Test message sent successfully!'));
                            } else {
                              showErrorToast(t('profile.testMessageFailed', 'Failed to send test message.'));
                            }
                          }
                        } catch (error) {
                          showErrorToast(t('profile.testMessageError', 'Error sending test message.'));
                        }
                      }}
                      className="px-3 py-1 bg-purple-600 text-white dark:bg-purple-700 rounded text-sm hover:bg-purple-700 dark:hover:bg-purple-800"
                    >
                      {t('profile.testTelegramMessage', 'Test Telegram')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSetupTelegram}
            disabled={!formData.telegram_bot_token || telegramSetupStatus === 'loading'}
            className={`px-4 py-2 rounded-md ${
              !formData.telegram_bot_token || telegramSetupStatus === 'loading'
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            {telegramSetupStatus === 'loading'
              ? t('profile.settingUp', 'Setting up...')
              : t('profile.setupTelegram', 'Setup Telegram')}
          </button>
        </div>
      </div>

      {/* Task Summary Notifications Subsection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-green-500" />
          {t('profile.taskSummaryNotifications', 'Task Summary Notifications')}
        </h4>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex items-start">
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>
            {t('profile.taskSummaryDescription', 'Receive regular summaries of your tasks via Telegram. This feature requires your Telegram integration to be set up.')}
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.enableTaskSummary', 'Enable Task Summaries')}
          </label>
          <div
            className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
              formData.task_summary_enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                task_summary_enabled: !prev.task_summary_enabled
              }));
            }}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                formData.task_summary_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.summaryFrequency', 'Summary Frequency')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['1h', '2h', '4h', '8h', '12h', 'daily', 'weekly'].map((frequency) => (
              <button
                key={frequency}
                type="button"
                className={`px-3 py-1.5 text-sm rounded-full ${
                  formData.task_summary_frequency === frequency
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    task_summary_frequency: frequency
                  }));
                }}
              >
                {t(`profile.frequency.${frequency}`, formatFrequency(frequency))}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('profile.frequencyHelp', 'Choose how often you want to receive task summaries.')}
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={!profile?.telegram_bot_token || !profile?.telegram_chat_id}
            className={`px-4 py-2 rounded-md ${
              !profile?.telegram_bot_token || !profile?.telegram_chat_id
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
            onClick={async () => {
              try {
                const response = await fetch('/api/profile/task-summary/send-now', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                  const data = await response.json();
                  throw new Error(data.error || t('profile.sendSummaryFailed'));
                }

                const data = await response.json();
                showSuccessToast(data.message);
              } catch (error) {
                showErrorToast((error as Error).message);
              }
            }}
          >
            {t('profile.sendTestSummary', 'Send Test Summary')}
          </button>
          {(!profile?.telegram_bot_token || !profile?.telegram_chat_id) && (
            <p className="mt-2 text-xs text-red-500">
              {t('profile.telegramRequiredForSummaries', 'Telegram integration must be set up to use task summaries.')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramSettingsTab;