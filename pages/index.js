import Head from 'next/head';

// 为了代码整洁，我们将SVG图标定义为React组件
// 您可以将它们放在一个单独的文件中，但为了方便，我们直接内联在这里

const IconWallet = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m12 6H9" />
  </svg>
);

const IconChartBar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const IconSend = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const IconActivity = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h.007v.007H3.75V12zm3.75 0h.007v.007H7.5V12zm3.75 0h.007v.007h-.007V12zm3.75 0h.007v.007h-.007V12zm3.75 0h.007v.007h-.007V12zm3.75 0h.007v.007h-.007V12z" />
    </svg>
);

const IconBolt = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const IconClock = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconDocumentText = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 16.5h-3" />
    </svg>
);

const IconArrowUpRight = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

const IconGauge = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5-1.5-.5M6.75 7.364l-1.5 .545m0 0l-1.5-.5" />
    </svg>
);


// 主页面组件
export default function Dashboard() {
  const kpiData = [
    {
      title: '账户数据',
      icon: IconWallet,
      metrics: [
        { label: '当前余额', value: '$5.36', icon: '¥', color: 'blue' },
        { label: '历史消耗', value: '$15.64', icon: '📊', color: 'purple' },
      ],
      chart: <svg className="w-20 h-8" fill="none" stroke="currentColor" viewBox="0 0 80 32"><path d="M0 28 l 10 -10 l 15 5 l 20 -15 l 15 10 l 20 -5"/></svg>
    },
    {
      title: '使用统计',
      icon: IconActivity,
      metrics: [
        { label: '请求次数', value: '520', icon: '➢', color: 'green' },
        { label: '统计次数', value: '63', icon: '〰', color: 'teal' },
      ],
      chart: <svg className="w-20 h-8 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 80 32"><path d="M0 25 l 20 -15 l 20 10 l 20 -18 l 20 10"/></svg>
    },
    {
        title: '资源消耗',
        icon: IconBolt,
        metrics: [
          { label: '统计额度', value: '$0.95', icon: '💰', color: 'yellow' },
          { label: '统计Tokens', value: '479082', icon: '𝐓', color: 'pink' },
        ],
        chart: <svg className="w-20 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 80 32"><path d="M0 20 c 20 -15, 40 15, 60 -10 l 20 10"/></svg>
      },
      {
        title: '性能指标',
        icon: IconClock,
        metrics: [
          { label: '平均RPM', value: '0.042', icon: '🕒', color: 'indigo' },
          { label: '平均TPM', value: '319.388', icon: 'Ag', color: 'orange' },
        ],
        chart: <svg className="w-20 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 80 32"><path d="M0 15 l 20 10 l 20 -18 l 20 15 l 20 -8"/></svg>
      },
  ];

  const chartData = [
    { time: '08-19 18:00', value: 0 },
    { time: '08-19 19:00', value: 10, color: 'bg-yellow-400' },
    { time: '08-19 20:00', value: 24, color: 'bg-yellow-400' },
    { time: '08-19 21:00', value: 13, color: 'bg-yellow-400' },
    { time: '08-19 22:00', value: 0 },
    { time: '08-19 23:00', value: 10, stacks: [{value: 4, color: 'bg-pink-400'}, {value: 3, color: 'bg-green-400'}]},
    { time: '08-20 00:00', value: 36, color: 'bg-yellow-400' },
  ];

  const apiInfo = [
    { name: '美国线路', url: 'https://globalai.vip', desc: '主线路-国内直连', icon: '🇺🇸', color: 'blue' },
    { name: '香港线路', url: 'https://hk.globalai.vip', desc: '备用节点1', icon: '🇭🇰', color: 'green' },
    { name: 'Cloudflare', url: 'https://api.globalai.vip', desc: '备用线路2', icon: 'c L', color: 'sky' },
  ]
  
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'bg-purple-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'bg-green-500' },
    teal: { bg: 'bg-cyan-100', text: 'text-cyan-600', icon: 'bg-cyan-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'bg-yellow-500' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', icon: 'bg-pink-500' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: 'bg-indigo-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'bg-orange-500' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-600', icon: 'bg-sky-500' },
  };

  return (
    <>
      <Head>
        <title>Dashboard | My Quota Checker</title>
        <meta name="description" content="Professional dashboard UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="mr-2">👋</span>晚上好, yuzhou
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200">
                <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25h-6.75a2.25 2.25 0 00-2.25 2.25v6.75" />
                </svg>
              </button>
            </div>
          </header>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpiData.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-gray-600 font-semibold">{item.title}</h2>
                    {React.createElement(item.icon, { className: "w-6 h-6 text-gray-400" })}
                </div>
                {item.metrics.map((metric, mIndex) =>(
                     <div key={mIndex} className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${colorMap[metric.color].bg} ${colorMap[metric.color].text}`}>
                            {metric.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{metric.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end mt-2">
                    {item.chart}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">模型数据分析</h2>
                <div className="flex space-x-2 border-b mb-6">
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md">消耗分布</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-md">消耗趋势</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-md">调用次数分布</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-md">调用次数排行</button>
                </div>
                <div className="mb-4">
                    <h3 className="text-gray-700 font-semibold">模型消耗分布</h3>
                    <p className="text-sm text-gray-500">总计: $0.95</p>
                </div>
                <div className="h-72 flex justify-around items-end space-x-2">
                 {chartData.map((bar, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="w-10/12 flex flex-col justify-end" style={{ height: `${bar.value * 8}px` }}>
                            {bar.stacks ? (
                                <>
                                    <div className="bg-yellow-400" style={{'height': `${bar.value - bar.stacks.reduce((acc, s) => acc + s.value, 0)}%`}}></div>
                                    {bar.stacks.map((stack, sIndex) => (
                                        <div key={sIndex} className={stack.color} style={{'height': `${stack.value}%`}}></div>
                                    ))}
                                </>
                            ) : (
                                <div className={bar.color} style={{'height': '100%'}}></div>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{bar.time}</span>
                    </div>
                 ))}
                </div>
            </div>

            {/* API Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <IconDocumentText className="w-6 h-6 mr-2 text-gray-500"/>
                    API信息
                </h2>
                <div className="space-y-4">
                    {apiInfo.map((api, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                             <div className="flex items-start space-x-4">
                               <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-sm font-bold ${colorMap[api.color].bg} ${colorMap[api.color].text}`}>
                                   {api.icon}
                               </div>
                               <div>
                                   <h3 className="font-semibold text-gray-800">{api.name}</h3>
                                   <p className="text-blue-600 font-medium text-sm truncate">{api.url}</p>
                                   <p className="text-xs text-gray-500">{api.desc}</p>
                               </div>
                             </div>
                             <div className="flex justify-end space-x-2 mt-2">
                                <button className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <IconGauge className="w-3 h-3"/>
                                    <span>测速</span>
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <IconArrowUpRight className="w-3 h-3"/>
                                    <span>跳转</span>
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
