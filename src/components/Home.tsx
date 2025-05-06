import React, { useEffect, useState } from 'react';
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useThemeContext } from './ThemeContext';
// import '../styles/white-dashboard.css';

interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const Home: React.FC = () => {
  const { mode } = useThemeContext();
  
  // Check if user is a Sales Manager
  const [isSalesManager, setIsSalesManager] = useState(false);
  
  useEffect(() => {
    // Check if the body has the sales-manager data-role attribute
    const hasSalesManagerRole = document.body.getAttribute('data-role') === 'sales-manager';
    setIsSalesManager(hasSalesManagerRole);
  }, []);
  
  // Chart colors based on theme and role
  const barColor1 = isSalesManager ? '#d32f2f' : (mode === 'dark' ? '#8884d8' : '#4a4ad8');
  const barColor2 = isSalesManager ? '#f44336' : (mode === 'dark' ? '#82ca9d' : '#2e9d6a');
  const lineColor1 = isSalesManager ? '#d32f2f' : (mode === 'dark' ? '#8884d8' : '#4a4ad8');
  const lineColor2 = isSalesManager ? '#f44336' : (mode === 'dark' ? '#82ca9d' : '#2e9d6a');
  
  const data: ChartData[] = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>{isSalesManager ? 'SALES MANAGER DASHBOARD' : 'DASHBOARD'}</h3>
      </div>

      <div className="main-cards">
        {/* Products Card */}
        <div className="card" role="region" aria-label="Products summary">
          <div className="card-inner">
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>300</h1>
        </div>

        {/* Categories Card */}
        <div className="card" role="region" aria-label="Categories summary">
          <div className="card-inner">
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>12</h1>
        </div>

        {/* Customers Card */}
        <div className="card" role="region" aria-label="Customers summary">
          <div className="card-inner">
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>

        {/* Alerts Card */}
        <div className="card" role="region" aria-label="Alerts summary">
          <div className="card-inner">
            <h3>ALERTS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className="charts" style={{ 
        backgroundColor: isSalesManager ? '#ffffff' : (mode === 'dark' ? 'rgba(38, 48, 67, 0.6)' : 'rgba(255, 255, 255, 0.6)'),
        padding: '15px',
        borderRadius: '8px',
        boxShadow: isSalesManager ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none',
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isSalesManager ? '#fff' : (mode === 'dark' ? '#263043' : '#fff'),
                color: isSalesManager ? '#333' : (mode === 'dark' ? '#fff' : '#333'),
                border: isSalesManager ? '1px solid #d32f2f' : `1px solid ${mode === 'dark' ? '#555' : '#ddd'}`,
                boxShadow: isSalesManager ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
              }} 
            />
            <Legend />
            <Bar dataKey="pv" fill={barColor1} />
            <Bar dataKey="uv" fill={barColor2} />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isSalesManager ? '#fff' : (mode === 'dark' ? '#263043' : '#fff'),
                color: isSalesManager ? '#333' : (mode === 'dark' ? '#fff' : '#333'),
                border: isSalesManager ? '1px solid #d32f2f' : `1px solid ${mode === 'dark' ? '#555' : '#ddd'}`,
                boxShadow: isSalesManager ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke={lineColor1} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke={lineColor2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Home;
