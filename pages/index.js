// 导入React和useState以管理输入框的状态和查询结果
import React, { useState } from 'react';
import Head from 'next/head';

// 图标组件，用于加载状态和成功/失败提示
const IconSpinner = (props) => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const IconCheckCircle = (props) => (
  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconExclamationCircle = (props) => (
    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function ApiKeyQuery() {
  // 使用state管理API Key输入值
  const [apiKey, setApiKey] = useState('');
  
  // 管理加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 管理查询结果
  const [result, setResult] = useState(null);

  const handleQuery = (e) => {
    e.preventDefault(); // 防止表单默认提交行为
    
    if (!apiKey) {
      setResult({
        success: false,
        message: '请输入API Key。'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // --- 模拟API调用 ---
    setTimeout(() => {
      if (apiKey.includes('valid')) { 
        setResult({
          success: true,
          total_granted: 5.0,
          total_used: 1.25,
          total_available: 3.75,
        });
      } else { 
        setResult({
          success: false,
          message: 'API Key 无效或已过期。'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>API Key 余额查询</title>
        <meta name="description" content="查询您的API Key剩余额度" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-md px-4 py-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-blue-600 mb-10">
            API Key 余额查询
          </h1>

          <form onSubmit={handleQuery}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的 API Key，例如 sk-..."
              className="w-full px-4 py-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-4 font-semibold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <IconSpinner />
                  <span>查询中...</span>
                </>
              ) : (
                '立即查询'
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-lg shadow-md border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {result.success ? (
                <div>
                   <div className="flex items-center mb-4">
                        <IconCheckCircle />
                        <h2 className="ml-2 text-xl font-semibold text-green-800">查询成功</h2>
                   </div>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>总额度:</strong> ${result.total_granted.toFixed(2)}</p>
                    <p><strong>已使用:</strong> ${result.total_used.toFixed(2)}</p>
                    <p className="font-bold text-green-800"><strong>剩余可用:</strong> ${result.total_available.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                    <IconExclamationCircle />
                    <p className="ml-2 font-semibold text-red-800">{result.message}</p>
                </div>
              )}
            </div>
          )}
           <div className="text-center mt-4 text-sm text-gray-500">
                <p>测试提示：输入包含 `valid` 的密钥可模拟成功响应。</p>
            </div>
        </div>
        
        {/* --- 新增的页脚部分 --- */}
        <footer className="w-full py-6 text-center text-gray-500 text-sm mt-auto">
            <p>
                © 2025 Quota Checker. 由 <a href="https://space.bilibili.com/39539856" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">闲鱼小铺：宇宙编辑部 boom</a> 提供技术支持.
            </p>
        </footer>
        {/* --- 页脚部分结束 --- */}

      </main>
    </>
  );
}
