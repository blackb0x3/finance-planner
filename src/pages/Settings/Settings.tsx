import { useSettings } from '../../contexts/SettingsContext';
import './Settings.css';

const Settings = () => {
  const { theme, setTheme, isDarkMode } = useSettings();

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-group">
          <label>Theme</label>
          <div className="theme-options">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              className={`theme-option ${theme === 'system' ? 'active' : ''}`}
              onClick={() => setTheme('system')}
            >
              System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 