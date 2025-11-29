import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceMonitoring } from '@/lib/performance-monitor';
import { initSentry } from '@/lib/sentry';
import { initCloudflareBeacon } from '@/lib/cloudflare';
// Initialize monitoring and error tracking
initSentry();
initCloudflareBeacon();
initPerformanceMonitoring();
// Render app (providers are already inside App.tsx)
createRoot(document.getElementById('root')!).render(<App />);