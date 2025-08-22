import { useState, useEffect } from 'react';

// --- 样式对象 (内联, 无需额外CSS文件) ---
const styles = {
  container: { padding: '0 2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' },
  main: { minHeight: '100vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { margin: '0 0 2rem 0', lineHeight: '1.15', fontSize: '3rem', textAlign: 'center' },
  grid: { display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '900px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { borderBottom: '2px solid #0070f3', padding: '12px 15px', textAlign: 'left', backgroundColor: '#f8f9fa', color: '#333', fontWeight: '600' },
  td: { borderBottom: '1px solid #eaeaea', padding: '10px 15px', textAlign: 'left' },
  keyName: { fontWeight: 'bold' },
  key: { fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: '#f0f0f0', padding: '2px 5px', borderRadius: '4px' },
  currency: { fontFamily: 'monospace', fontSize: '1rem' },
  statusActive: { color: 'green' },
  statusInactive: { color: 'red' },
  error: { color: 'red', fontWeight: 'bold' },
  loading: { fontSize: '1.2rem', color: '#555' }
};

// --- 额度转换核心函数 ---
const CONVERSION_RATE = 500000; // 500,000点 = $1.00
const convertToUSD = (quota) => (quota / CONVERSION_RATE).toFixed(4);

// --- 页面核心组件 ---
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/check', { method: 'POST' });
        if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) return <p style={styles.loading}>正在查询额度信息，请稍候...</p>;
    if (error) return <p style={styles.error}>出错了: {error}</p>;
    if (!items || items.length === 0) return <p>成功连接，但未获取到任何密钥信息。</p>;

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>名称</th>
            <th style={styles.th}>密钥 (部分)</th>
            <th style={styles.th}>已用额度 (USD)</th>
            <th style={styles.th}>剩余额度 (USD)</th>
            <th style={styles.th}>总额度 (USD)</th>
            <th style={styles.th}>状态</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            // --- 这里是核心修正 ---
            // 已用额度 = used_quota
            // 剩余额度 = remain_quota
            const usedUSD = convertToUSD(item.used_quota);
            const remainingUSD = convertToUSD(item.remain_quota);
            const totalUSD = item.unlimited_quota
              ? '无限制'
              : (parseFloat(usedUSD) + parseFloat(remainingUSD)).toFixed(4);

            return (
              <tr key={item.id}>
                <td style={{...styles.td, ...styles.keyName}}>{item.name}</td>
                <td style={styles.td}><code style={styles.key}>{`${item.key.substring(0, 8)}...`}</code></td>
                <td style={{...styles.td, ...styles.currency}}>${usedUSD}</td>
                <td style={{...styles.td, ...styles.currency}}>${remainingUSD}</td>
                <td style={{...styles.td, ...styles.currency}}>{totalUSD.startsWith('无') ? totalUSD : `$${totalUSD}`}</td>
                <td style={item.status === 1 ? styles.statusActive : styles.statusInactive}>{item.status === 1 ? '✅ 正常' : '❌ 禁用'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>密钥额度查询面板</h1>
        <div style={styles.grid}>{renderContent()}</div>
      </main>
    </div>
  );
}
