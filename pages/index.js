// pages/index.js
import React, { useState } from 'react';
import Head from 'next/head';

const IconSpinner = (props) => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );
const IconCheckCircle = (props) => ( <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> );
const IconExclamationCircle = (props) => ( <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> );

export default function ApiKeyQueryPage() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleQuery = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!apiKey) {
      setResult({ success: false, message: '请输入API Key。' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: '请求失败，请检查网络连接或后台服务。' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatQuota = (quota) => {
      if (quota > 10000) {
          return `${(quota / 10000).toFixed(2)}万`;
      }
      return quota.toLocaleString();
  }

  return (
    <>
      <Head>
        <title>API Key 余额查询 for globalai.vip</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-8">
            额度查询 (最终验证版 2.0)
          </h1>
          <form onSubmit={handleQuery}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的 globalai.vip API Key (sk-...)"
              className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 px-4 py-3 font-semibold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? ( <> <IconSpinner /> <span>查询中...</span> </> ) : ( '立即查询' )}
            </button>
          </form>
          {result && (
            <div className={`mt-6 p-5 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {result.success ? (
                <div>
                   <div className="flex items-center mb-3">
                        <IconCheckCircle />
                        <h2 className="ml-2 text-lg font-semibold text-green-800">查询成功</h2>
                   </div>
                  <div className="space-y-2 text-gray-800">
                    {result.is_unlimited ? (
                        <p className="font-bold text-lg text-green-900">此Key为无限额度</p>
                    ) : (
                        <>
                           <p><strong>总额度 (单位):</strong> {formatQuota(result.used_quota + result.remain_quota)}</p>
                           <p><strong>已使用 (单位):</strong> {formatQuota(result.used_quota)}</p>
                           <p className="font-bold text-lg text-green-900"><strong>剩余可用 (单位):</strong> {formatQuota(result.remain_quota)}</p>
                        </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                    <IconExclamationCircle />
                    <p className="ml-2 font-medium text-red-800">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="w-full py-6 text-center text-gray-500 text-sm mt-6">
            <p>
                © {new Date().getFullYear()} Quota Checker. 由 <a href="https://space.bilibili.com/39539856" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">闲鱼小铺：宇宙编辑部 boom</a> 提供技术支持.
            </p>
        </footer>
      </main>
    </>
  );
}
