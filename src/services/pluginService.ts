import { PluginManifest } from '../types/enterprisePlatform';

const STORAGE_KEY = 'satpura_plugins_v1';

const INITIAL_PLUGINS: PluginManifest[] = [
  {
    pluginId: 'plugin-ocr-devanagari',
    name: 'Devanagari OCR & Manuscript Reader',
    version: '2.4.1',
    author: 'Satpura AI Labs',
    description: 'Advanced optical character recognition for historical Devanagari and modified Modi scripts.',
    type: 'ocr',
    minPlatformVersion: '1.0.0',
    permissions: ['corpus:read', 'media:write'],
    dependencies: [],
    enabled: true,
    installedAt: new Date(Date.now() - 864000000).toISOString()
  },
  {
    pluginId: 'plugin-pawari-translator',
    name: 'Pawari-Hindi Neural Translator',
    version: '1.8.0',
    author: 'Tapti Linguistics',
    description: 'Bilingual neural machine translation fine-tuned on Satpura Pawari dialects.',
    type: 'translation',
    minPlatformVersion: '1.0.0',
    permissions: ['dictionary:read', 'corpus:read'],
    dependencies: [],
    enabled: true,
    installedAt: new Date(Date.now() - 500000000).toISOString()
  },
  {
    pluginId: 'plugin-gis-satpura',
    name: 'Satpura Historical GIS & Map Engine',
    version: '3.0.2',
    author: 'GeoHeritage Consortium',
    description: 'Interactive map layer for historical migration trails of Parmar/Pawar dynasties.',
    type: 'map',
    minPlatformVersion: '1.0.0',
    permissions: ['history:read', 'places:read'],
    dependencies: [],
    enabled: false,
    installedAt: new Date(Date.now() - 200000000).toISOString()
  }
];

export const PluginService = {
  getPlugins: (): PluginManifest[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PLUGINS));
        return INITIAL_PLUGINS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PLUGINS;
    }
  },

  togglePlugin: (pluginId: string): PluginManifest[] => {
    const list = PluginService.getPlugins();
    const p = list.find(item => item.pluginId === pluginId);
    if (p) {
      p.enabled = !p.enabled;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('plugins_changed'));
    }
    return list;
  },

  installPlugin: (manifest: PluginManifest) => {
    const list = PluginService.getPlugins();
    list.unshift(manifest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('plugins_changed'));
  }
};
