import Head from 'next/head';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'; // 我们会使用一些默认样式

export default function Home() {
  // 创建三个“状态”来存放我们的数据
  // 1. loading: 追踪是否正在加载中
  // 2. error: 存放可能出现的错误信息
  // 3. creditInfo: 存放从API成功获取的额度信息
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditInfo, setCreditInfo] = useState(null);

  // useEffect 是一个钩子函数，它会在组件第一次加载到屏幕上时运行
  // 这正是我们发起API请求的最佳时机
  useEffect(() => {
    // 定义一个异步函数来获取数据
    async function fetchData() {
      try {
        // 使用 fetch 请求我们自己的后端API
        // 在Next.js中，可以直接使用相对路径
        const response = await fetch('/api/check');

        // 如果请求失败（比如服务器返回404或500错误），则抛出一个错误
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 将返回的JSON数据解析出来
        const data = await response.json();
        // 将数据存入我们的状态中
        setCreditInfo(data);
      } catch (e) {
        // 如果捕获到任何错误，就将错误信息存入状态
        setError(e.message);
      } finally {
        // 无论成功还是失败，最后都将加载状态设置为false
        setLoading(false);
      }
    }

    // 调用上面定义的函数，开始获取数据
    fetchData();
  }, []); // 空数组 [] 确保这个 effect 只运行一次

  // --- 渲染部分 ---
  // 根据不同的状态，返回不同的HTML内容
  return (
    <div className={styles.container}>
      <Head>
        <title>Global AI Credit Checker</title>
        <meta name="description" content="Check your Global AI API credit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Global AI API 额度查询
        </h1>

        <div className={styles.description}>
          {/* 条件渲染逻辑 */}
          {loading && <p>正在查询，请稍候...</p>}
          {error && <p style={{ color: 'red' }}>查询失败：{error}</p>}
          {creditInfo && (
            <div>
              <p>剩余总额度 (Total Remaining): ${creditInfo.total_remaining.toFixed(2)}</p>
              <p>已用额度 (Total Used): ${creditInfo.total_used.toFixed(2)}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
