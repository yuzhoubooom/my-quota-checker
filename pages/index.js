import { useState, useEffect } from 'react';

// --- 基础样式（直接内联，无需CSS文件）---
const styles = {
  container: {
    padding: '0 2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  main: {
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    margin: '0 0 2rem 0',
    lineHeight: '1.15',
    fontSize: '3rem',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '800px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1.5rem',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#0070f3',
    color: 'white',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  key: {
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#555',
  }
};


// --- 页面组件 ---
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 调用我们部署在Vercel上的后端API
        const response = await fetch('/api/check', {
          method: 'POST'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setItems(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 空数组确保仅在组件加载时执行一次

  const renderContent = () => {
    if (isLoading) {
      return <p style={styles.loading}>正在从服务器获取密钥列表，请稍候...</p>;
    }

    if (error) {
      return <p style={styles.error}>出错了: {error}</p>;
    }

    if (!items || items.length === 0) {
      return <p>成功连接，但未获取到任何数据。</p>;
    }

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>名称</th>
            <th style={styles.th}>密钥 (部分)</th>
            <th style={styles.th}>剩余额度</th>
            <th style={styles.th}>状态</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.id}</td>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}><code style={styles.key}>{`${item.key.substring(0, 8)}...`}</code></td>
              <td style={styles.td}>{item.unlimited_quota ? '无限制' : item.remain_quota}</td>
              <td style={styles.td}>{item.status === 1 ? '✅ 正常' : '❌ 禁用'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>
          密钥管理面板
        </h1>
        <div style={styles.grid}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
