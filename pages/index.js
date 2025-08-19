// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  // 使用 useState 来管理用户输入的 token
  const [token, setToken] = useState('');
  // 管理查询结果
  const [result, setResult] = useState(null);
  // 管理加载状态，提升用户体验
  const [isLoading, setIsLoading] = useState(false);
  // 管理错误信息
  const [error, setError] = useState('');

  // 处理查询按钮点击事件
  const handleCheckBalance = async () => {
    if (!token.trim()) {
      setError('请输入您的Token。');
      return;
    }
    
    // 开始查询，进入加载状态
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      // 向我们之前创建的后端API(/api/check)发送请求
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });

      // 解析返回的JSON数据
      const data = await response.json();

      if (!response.ok) {
        // 如果API返回错误（例如403, 500等），则抛出错误
        throw new Error(data.error || '查询失败，请稍后再试。');
      }
      
      // 更新查询结果
      setResult(data);

    } catch (err) {
      // 捕获并显示错误信息
      setError(err.message);
    } finally {
      // 查询结束，无论成功或失败，都取消加载状态
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>额度查询工具</title>
        <meta name="description" content="一个简单的额度查询工具" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          欢迎使用额度查询工具
        </h1>

        <p className={styles.description}>
          请输入您的Token以查询剩余额度
        </p>

        <div className={styles.grid}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="在此输入您的 API Token"
            className={styles.input}
            disabled={isLoading} // 加载时禁用输入框
          />
          <button onClick={handleCheckBalance} className={styles.button} disabled={isLoading}>
            {isLoading ? '查询中...' : '立即查询'}
          </button>
        </div>

        {/* 根据不同状态显示不同内容 */}
        {error && <p className={styles.errorText}>{error}</p>}
        
        {result && (
          <div className={styles.resultCard}>
            <h2>查询结果:</h2>
            <p>总额度: {result.total_granted}</p>
            <p>已使用: {result.total_used}</p>
            <p>剩余额度: <strong>{result.total_available}</strong></p>
          </div>
        )}
        
      </main>
    </div>
  );
}

