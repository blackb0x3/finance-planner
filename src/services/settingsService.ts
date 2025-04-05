import { dataService } from './dataService';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppSettings {
  theme: ThemeMode;
}

class SettingsService {
  private readonly FILENAME = 'app_settings.json';
  private settings: AppSettings = {
    theme: 'system'
  };

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const loadedSettings = await dataService.readFile<AppSettings>(this.FILENAME);
      if (loadedSettings) {
        this.settings = loadedSettings;
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  }

  async getSettings(): Promise<AppSettings> {
    return this.settings;
  }

  async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    await dataService.writeFile(this.FILENAME, this.settings);
  }

  getTheme(): ThemeMode {
    return this.settings.theme;
  }

  async setTheme(theme: ThemeMode): Promise<void> {
    await this.updateSettings({ theme });
  }
}

export const settingsService = new SettingsService(); 