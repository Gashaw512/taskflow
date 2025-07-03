// components/Shared/FallbackLoading.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const FallbackLoading: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      <p>{t('common.loading', 'Loading...')}</p>
    </div>
  );
};

export default FallbackLoading;