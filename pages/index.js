// pages/index.js

import { useState } from 'react';
import Head from 'next/head';

// 一个小组件，用于显示加载动画（菊花图）
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function HomePage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '发生未知错误');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>额度查询中心</title>
        <meta name="description" content="专业API Key额度查询工具" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            AI Key 额度查询
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            请输入您的API Token以查询剩余额度
          </p>

          <form onSubmit={handleQuery}>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="sk-..."
                className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isLoading ? <Spinner /> : '查询'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-center">
              <p><strong>查询失败：</strong> {error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">查询结果</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">总额度</span>
                  <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                    {result.total_granted === "无限" ? "∞" : `$${result.total_granted}`}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">已使用</span>
                  <span className="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400">
                    ${result.total_used}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <span className="font-bold text-green-700 dark:text-green-300">可用余额</span>
                  <span className="text-2xl font-mono font-bold text-green-700 dark:text-green-300">
                    {result.total_available === "无限" ? "∞" : `$${result.total_available}`}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
        <footer className="w-full max-w-md mx-auto mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; 2025 Quota Checker. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
