import { invoke } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';

class DataService {
  private async getDataDir(): Promise<string> {
    const appDir = await appDataDir();
    const dataDir = await join(appDir, 'data');
    console.log(dataDir);

    return dataDir;
  }

  private async ensureDataDir(): Promise<void> {
    const dataDir = await this.getDataDir();

    await invoke('create_dir', { path: dataDir });
  }

  async readFile<T>(filename: string): Promise<T | undefined> {
    await this.ensureDataDir();
    const dataPath = await this.getDataDir();
    const readPath = await join(dataPath, filename);
    
    try {
      const content = await invoke('read_file', { path: readPath });

      return JSON.parse(content as string);
    } catch (error) {
      // If file doesn't exist, return undefined
      return undefined;
    }
  }

  async writeFile<T>(filename: string, data: T): Promise<void> {
    await this.ensureDataDir();
    const dataPath = await this.getDataDir();
    const writePath = await join(dataPath, filename);
    
    await invoke('write_file', { 
      path: writePath, 
      contents: JSON.stringify(data, null, 2) 
    });
  }
}

export const dataService = new DataService(); 