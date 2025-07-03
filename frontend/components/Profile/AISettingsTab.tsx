import React from 'react';
import { useTranslation } from 'react-i18next';
import { InformationCircleIcon, BoltIcon, ChevronRightIcon, ExclamationTriangleIcon, FaceSmileIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface AISettingsTabProps {
  formData: {
    task_intelligence_enabled: boolean;
    auto_suggest_next_actions_enabled: boolean;
    productivity_assistant_enabled: boolean;
    next_task_suggestion_enabled: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>; // More specific type if possible
}

const AISettingsTab: React.FC<AISettingsTabProps> = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <LightBulbIcon className="w-6 h-6 mr-3 text-blue-500" />
        {t('profile.aiProductivityFeatures', 'AI & Productivity Features')}
      </h3>

      {/* Task Intelligence Subsection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <BoltIcon className="w-5 h-5 mr-2 text-purple-500" />
          {t('profile.taskIntelligence', 'Task Intelligence')}
        </h4>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex items-start">
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>
            {t('profile.taskIntelligenceDescription', 'Get helpful suggestions to make your task names more descriptive and actionable.')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.enableTaskIntelligence', 'Enable Task Intelligence Assistant')}
          </label>
          <div
            className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
              formData.task_intelligence_enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                task_intelligence_enabled: !prev.task_intelligence_enabled
              }));
            }}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                formData.task_intelligence_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>
      </div>

      {/* Auto-Suggest Next Actions Subsection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <ChevronRightIcon className="w-5 h-5 mr-2 text-green-500" />
          {t('profile.autoSuggestNextActions', 'Auto-Suggest Next Actions')}
        </h4>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex items-start">
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>
            {t('profile.autoSuggestNextActionsDescription', 'When creating a project, automatically prompt for the very next physical action to take.')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.enableAutoSuggestNextActions', 'Enable Next Action Prompts')}
          </label>
          <div
            className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
              formData.auto_suggest_next_actions_enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                auto_suggest_next_actions_enabled: !prev.auto_suggest_next_actions_enabled
              }));
            }}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                formData.auto_suggest_next_actions_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>
      </div>

      {/* Productivity Assistant Subsection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-500" />
          {t('profile.productivityAssistant', 'Productivity Assistant')}
        </h4>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex items-start">
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>
            {t('profile.productivityAssistantDescription', 'Show productivity insights that help identify stalled projects, vague tasks, and workflow improvements on your Today page.')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.enableProductivityAssistant', 'Enable Productivity Insights')}
          </label>
          <div
            className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
              formData.productivity_assistant_enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                productivity_assistant_enabled: !prev.productivity_assistant_enabled
              }));
            }}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                formData.productivity_assistant_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>
      </div>

      {/* Next Task Suggestion Subsection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <FaceSmileIcon className="w-5 h-5 mr-2 text-green-500" />
          {t('profile.nextTaskSuggestion', 'Next Task Suggestion')}
        </h4>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex items-start">
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>
            {t('profile.nextTaskSuggestionDescription', 'Automatically suggest the next best task to work on when you have nothing in progress, prioritizing due today tasks, then suggested tasks, then next actions.')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.enableNextTaskSuggestion', 'Enable Next Task Suggestions')}
          </label>
          <div
            className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
              formData.next_task_suggestion_enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                next_task_suggestion_enabled: !prev.next_task_suggestion_enabled
              }));
            }}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                formData.next_task_suggestion_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsTab;