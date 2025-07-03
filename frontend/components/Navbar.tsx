import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

// Assuming PomodoroTimer is a component that doesn't need to be imported dynamically based on a prop.
// If it truly depends on `pomodoroEnabled`, keeping it as a direct import is fine.
import PomodoroTimer from "./Shared/PomodoroTimer";

/**
 * @interface CurrentUser
 * Defines the structure for the current user object.
 */
interface CurrentUser {
  email: string;
  avatarUrl?: string; // avatarUrl is optional
}

/**
 * @interface NavbarProps
 * Defines the props accepted by the Navbar component.
 */
interface NavbarProps {
  currentUser: CurrentUser | null; // User can be logged in or not
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Navbar component provides navigation, user menu, and integrates features like Pomodoro Timer.
 * It's designed to be a fixed header for the application.
 *
 * @param {NavbarProps} props - The props for the Navbar component.
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  setCurrentUser,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pomodoroEnabled, setPomodoroEnabled] = useState(true); // Default to true until fetched
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /**
   * Effect to handle clicks outside the user dropdown, closing it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if click is outside the dropdown area
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  /**
   * Effect to fetch the user's Pomodoro setting from the API on component mount
   * and listen for real-time updates to this setting.
   */
  useEffect(() => {
    const fetchPomodoroSetting = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include' // Ensures cookies are sent with the request
        });

        if (response.ok) {
          const profile = await response.json();
          // Update pomodoroEnabled state based on fetched profile data, defaulting to true
          setPomodoroEnabled(profile.pomodoro_enabled !== undefined ? Boolean(profile.pomodoro_enabled) : true);
        } else {
          console.warn('Failed to fetch profile settings, using default Pomodoro setting.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If fetch fails, pomodoroEnabled remains its initial state (true)
      }
    };

    fetchPomodoroSetting();

    // Custom event listener for when the Pomodoro setting is changed elsewhere in the app (e.g., ProfileSettings)
    const handlePomodoroSettingChange = (event: CustomEvent) => {
      if (typeof event.detail.enabled === 'boolean') {
        setPomodoroEnabled(event.detail.enabled);
      }
    };

    window.addEventListener('pomodoroSettingChanged', handlePomodoroSettingChange as EventListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('pomodoroSettingChanged', handlePomodoroSettingChange as EventListener);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * Toggles the visibility of the user dropdown menu.
   */
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  /**
   * Handles the user logout process by calling the API and updating the user state.
   */
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setCurrentUser(null); // Clear the current user in the application state
        navigate('/login'); // Redirect to the login page
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData);
        // Optionally, show a user-friendly error message
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, show a generic error message for network issues
    }
  }, [setCurrentUser, navigate]); // Dependencies for useCallback

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md h-16">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left section: Sidebar toggle and app branding */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center focus:outline-none text-gray-500 dark:text-gray-500"
            aria-label={isSidebarOpen ? t("ariaLabels.collapseSidebar", "Collapse Sidebar") : t("ariaLabels.expandSidebar", "Expand Sidebar")}
          >
            <Bars3Icon className="h-6 mt-1 w-6 mr-2" />
          </button>

          <Link
            to="/"
            className="flex items-center no-underline text-gray-900 dark:text-white"
          >
            <span className="text-2xl font-bold">Taskflow</span>
          </Link>
        </div>

        {/* Right section: Pomodoro Timer and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Conditionally render PomodoroTimer based on user setting */}
          {pomodoroEnabled && <PomodoroTimer />}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
              aria-label={t("ariaLabels.userMenu", "User Menu")}
            >
              {/* Display user avatar or a default icon */}
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={t("altText.userAvatar", "User Avatar")}
                  className="h-8 w-8 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="h-8 w-8 rounded-full border-2 border-green-500 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </button>

            {/* User dropdown menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-10"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown when navigating
                >
                  {t('navigation.profileSettings', 'Profile Settings')}
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false); // Close dropdown before logging out
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('navigation.logout', 'Logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;