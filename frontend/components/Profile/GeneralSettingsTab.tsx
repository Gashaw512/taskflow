import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/outline';

interface GeneralSettingsTabProps {
  formData: {
    appearance: 'light' | 'dark';
    language: string;
    timezone: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ formData, handleChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <UserIcon className="w-6 h-6 mr-3 text-blue-500" />
        {t('profile.accountSettings', 'Account & Preferences')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.appearance')}
          </label>
          <select
            name="appearance"
            value={formData.appearance}
            onChange={handleChange}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">{t('profile.lightMode', 'Light')}</option>
            <option value="dark">{t('profile.darkMode', 'Dark')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.language')}
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en">{t('profile.english')}</option>
            <option value="es">{t('profile.spanish')}</option>
            <option value="el">{t('profile.greek')}</option>
            <option value="jp">{t('profile.japanese')}</option>
            <option value="ua">{t('profile.ukrainian')}</option>
            <option value="de">{t('profile.deutsch')}</option>
            <option value="am">Amharic (አማርኛ)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.timezone')}
          </label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="UTC">UTC</option>

            {/* Americas */}
            <optgroup label="Americas">
              <option value="America/New_York">Eastern Time (New York)</option>
              <option value="America/Chicago">Central Time (Chicago)</option>
              <option value="America/Denver">Mountain Time (Denver)</option>
              <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
              <option value="America/Anchorage">Alaska Time (Anchorage)</option>
              <option value="Pacific/Honolulu">Hawaii Time (Honolulu)</option>
              <option value="America/Toronto">Eastern Time (Toronto)</option>
              <option value="America/Vancouver">Pacific Time (Vancouver)</option>
              <option value="America/Mexico_City">Central Time (Mexico City)</option>
              <option value="America/Sao_Paulo">Brasília Time (São Paulo)</option>
              <option value="America/Argentina/Buenos_Aires">Argentina Time (Buenos Aires)</option>
              <option value="America/Lima">Peru Time (Lima)</option>
              <option value="America/Bogota">Colombia Time (Bogotá)</option>
              <option value="America/Caracas">Venezuela Time (Caracas)</option>
              <option value="America/Santiago">Chile Time (Santiago)</option>
            </optgroup>

            {/* Europe */}
            <optgroup label="Europe">
              <option value="Europe/London">Greenwich Mean Time (London)</option>
              <option value="Europe/Dublin">Greenwich Mean Time (Dublin)</option>
              <option value="Europe/Lisbon">Western European Time (Lisbon)</option>
              <option value="Europe/Paris">Central European Time (Paris)</option>
              <option value="Europe/Berlin">Central European Time (Berlin)</option>
              <option value="Europe/Madrid">Central European Time (Madrid)</option>
              <option value="Europe/Rome">Central European Time (Rome)</option>
              <option value="Europe/Amsterdam">Central European Time (Amsterdam)</option>
              <option value="Europe/Brussels">Central European Time (Brussels)</option>
              <option value="Europe/Vienna">Central European Time (Vienna)</option>
              <option value="Europe/Zurich">Central European Time (Zurich)</option>
              <option value="Europe/Prague">Central European Time (Prague)</option>
              <option value="Europe/Warsaw">Central European Time (Warsaw)</option>
              <option value="Europe/Stockholm">Central European Time (Stockholm)</option>
              <option value="Europe/Oslo">Central European Time (Oslo)</option>
              <option value="Europe/Copenhagen">Central European Time (Copenhagen)</option>
              <option value="Europe/Helsinki">Eastern European Time (Helsinki)</option>
              <option value="Europe/Athens">Eastern European Time (Athens)</option>
              <option value="Europe/Kiev">Eastern European Time (Kiev)</option>
              <option value="Europe/Moscow">Moscow Time (Moscow)</option>
              <option value="Europe/Istanbul">Turkey Time (Istanbul)</option>
            </optgroup>

            {/* Asia */}
            <optgroup label="Asia">
              <option value="Asia/Dubai">Gulf Standard Time (Dubai)</option>
              <option value="Asia/Tehran">Iran Standard Time (Tehran)</option>
              <option value="Asia/Yerevan">Armenia Time (Yerevan)</option>
              <option value="Asia/Baku">Azerbaijan Time (Baku)</option>
              <option value="Asia/Karachi">Pakistan Standard Time (Karachi)</option>
              <option value="Asia/Kolkata">India Standard Time (Mumbai/Delhi)</option>
              <option value="Asia/Kathmandu">Nepal Time (Kathmandu)</option>
              <option value="Asia/Dhaka">Bangladesh Standard Time (Dhaka)</option>
              <option value="Asia/Yangon">Myanmar Time (Yangon)</option>
              <option value="Asia/Bangkok">Indochina Time (Bangkok)</option>
              <option value="Asia/Ho_Chi_Minh">Indochina Time (Ho Chi Minh)</option>
              <option value="Asia/Jakarta">Western Indonesia Time (Jakarta)</option>
              <option value="Asia/Kuala_Lumpur">Malaysia Time (Kuala Lumpur)</option>
              <option value="Asia/Singapore">Singapore Standard Time (Singapore)</option>
              <option value="Asia/Manila">Philippines Time (Manila)</option>
              <option value="Asia/Hong_Kong">Hong Kong Time (Hong Kong)</option>
              <option value="Asia/Shanghai">China Standard Time (Beijing/Shanghai)</option>
              <option value="Asia/Taipei">China Standard Time (Taipei)</option>
              <option value="Asia/Tokyo">Japan Standard Time (Tokyo)</option>
              <option value="Asia/Seoul">Korea Standard Time (Seoul)</option>
              <option value="Asia/Vladivostok">Vladivostok Time (Vladivostok)</option>
            </optgroup>

            {/* Africa */}
            <optgroup label="Africa">
              <option value="Africa/Casablanca">Western European Time (Casablanca)</option>
              <option value="Africa/Lagos">West Africa Time (Lagos)</option>
              <option value="Africa/Cairo">Eastern European Time (Cairo)</option>
              <option value="Africa/Johannesburg">South Africa Standard Time (Johannesburg)</option>
              <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
              <option value="Africa/Addis_Ababa">East Africa Time (Addis Ababa)</option>
            </optgroup>

            {/* Oceania */}
            <optgroup label="Oceania">
              <option value="Australia/Perth">Australian Western Standard Time (Perth)</option>
              <option value="Australia/Adelaide">Australian Central Standard Time (Adelaide)</option>
              <option value="Australia/Darwin">Australian Central Standard Time (Darwin)</option>
              <option value="Australia/Brisbane">Australian Eastern Standard Time (Brisbane)</option>
              <option value="Australia/Sydney">Australian Eastern Standard Time (Sydney)</option>
              <option value="Australia/Melbourne">Australian Eastern Standard Time (Melbourne)</option>
              <option value="Pacific/Auckland">New Zealand Standard Time (Auckland)</option>
              <option value="Pacific/Fiji">Fiji Time (Suva)</option>
              <option value="Pacific/Guam">Chamorro Standard Time (Guam)</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;