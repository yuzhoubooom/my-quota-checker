import { useState } from 'react';

// --- 样式对象 (无需额外CSS文件) ---
const styles = {
  container: { padding: '0 2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' },
  main: { minHeight: '100vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { margin: '0 0 2rem 0', lineHeight: '1.15', fontSize: '32px', textAlign: 'center' },
  form: { width: '100%', maxWidth: '600px', display: 'flex', gap: '10px' },
  input: { flexGrow: '1', padding: '12px 15px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px' },
  button: { padding: '12px 20px', fontSize: '16px', border: 'none', borderRadius: '6px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' },
  resultArea: { marginTop: '30px', width: '100%', maxWidth: '600px' },
  resultCard: { background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  dl: { margin: 0 },
  dt: { fontWeight: 'bold', color: '#555', marginTop: '12px' },
  dd: { margin: '4px 0 0 0', fontSize: '18px', fontFamily: 'monospace', color: '#000', wordBreak: 'break-all' },
  ddStatusActive: { color: 'green' },
  ddStatusInactive: { color: 'red' },
  message: { textAlign: 'center', fontSize: '18px', padding: '20px' },
  errorMessage: { color: 'red' }
};

// --- 额度转换核心函数 ---
const CONVERSION_RATE = 500000; // 500,000点 = $1.00
const convertToUSD = (quota) => `$${(quota / CONVERSION_RATE).toFixed(4)}`;

export default function QueryPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '查询失败，请检查您的令牌。');
      }
      
      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (isLoading) return <p style={styles.message}>查询中...</p>;
    if (error) return <p style={{...styles.message, ...styles.errorMessage}}>{error}</p>;
    if (!result) return <p style={styles.message}>请输入您的令牌以查询额度信息。</p>;
    
    // 再次确认：根据我们之前的分析，API的remain_quota是已用，used_quota是剩余
    const usedUSD = convertToUSD(result.remain_quota);
    const remainingUSD = convertToUSD(result.used_quota);
    const totalUSD = convertToUSD(result.remain_quota + result.used_quota);

    return (
      <div style={styles.resultCard}>
        <dl style={styles.dl}>
          <dt style={styles.dt}>名称</dt>
          <dd style={styles.dd}>{result.name}</dd>
          
          <dt style={styles.dt}>状态</dt>
          <dd style={{...styles.dd, ...(result.status === 1 ? styles.ddStatusActive : styles.ddStatusInactive)}}>
            {result.status === 1 ? '✅ 正常' : '❌ 禁用'}
          </dd>
          
          <dt style={styles.dt}>已用额度</dt>
          <dd style={styles.dd}>{usedUSD}</dd>

          <dt style={styles.dt}>剩余额度</dt>
          <dd style={styles.dd}>{remainingUSD}</dd>
          
          <dt style={styles.dt}>总额度</dt>
          <dd style={styles.dd}>{totalUSD}</dd>
        </dl>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>个人令牌额度查询</h1>
        <form style={styles.form} onSubmit={handleSearch}>
          <input
            type="text"
            style={styles.input}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="请在此处粘贴您的令牌/密钥"
            aria-label="Token Input"
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? '查询中...' : '查询'}
          </button>
        </form>
        <div style={styles.resultArea}>
          {renderResult()}
        </div>
      </main>
    </div>
  );
}
