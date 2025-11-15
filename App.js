import React, { useState } from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return <AppNavigation />;
}
