'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE_URL } from '@/lib/utils';

export const ApiTestComponent = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      console.log('Testing connection to:', `${API_BASE_URL}/api/auth/login/`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'OPTIONS', // Preflight request
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('OPTIONS Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        setTestResult(`✅ API connection successful! 
Status: ${response.status}
CORS headers: ${response.headers.get('Access-Control-Allow-Credentials')}
Allow Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
      } else {
        setTestResult(`❌ API connection failed! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          API URL: <code className="bg-muted px-1 py-0.5 rounded">{API_BASE_URL}</code>
        </p>
        <Button onClick={testApiConnection} disabled={isLoading} className="w-full">
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Button>
        {testResult && (
          <div className="p-3 bg-muted rounded-md">
            <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};