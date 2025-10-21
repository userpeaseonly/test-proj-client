'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { ApiTestComponent } from '@/components/debug/api-test';

type AuthMode = 'login' | 'register' | 'test';

export const AuthContainer = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSwitchToRegister = () => setMode('register');
  const handleSwitchToLogin = () => setMode('login');
  const handleSwitchToTest = () => setMode('test');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Mode switcher */}
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={handleSwitchToLogin}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            Login
          </button>
          <button
            onClick={handleSwitchToRegister}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            Register
          </button>
          <button
            onClick={handleSwitchToTest}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'test' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            Test API
          </button>
        </div>
        
        {mode === 'login' && (
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        )}
        {mode === 'register' && (
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        )}
        {mode === 'test' && (
          <ApiTestComponent />
        )}
      </div>
    </div>
  );
};