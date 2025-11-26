'use client';

import { useEffect } from 'react';

export function NoIndexMeta() {
  useEffect(() => {
    // Remove existing robots meta tags
    const existingRobots = document.querySelector('meta[name="robots"]');
    const existingGooglebot = document.querySelector('meta[name="googlebot"]');
    
    if (existingRobots) existingRobots.remove();
    if (existingGooglebot) existingGooglebot.remove();

    // Add noindex meta tags
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);

    const googlebotMeta = document.createElement('meta');
    googlebotMeta.name = 'googlebot';
    googlebotMeta.content = 'noindex, nofollow';
    document.head.appendChild(googlebotMeta);

    return () => {
      // Cleanup on unmount
      if (robotsMeta.parentNode) robotsMeta.parentNode.removeChild(robotsMeta);
      if (googlebotMeta.parentNode) googlebotMeta.parentNode.removeChild(googlebotMeta);
    };
  }, []);

  return null;
}

