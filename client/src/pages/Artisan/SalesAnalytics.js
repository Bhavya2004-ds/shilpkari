import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
    FiDollarSign, FiTrendingUp, FiShoppingCart, FiPackage,
    FiBarChart2, FiArrowUp, FiArrowDown, FiCalendar, FiStar
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

/* ═══ Animations ═══ */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const gradShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ═══ Layout ═══ */
const Page = styled.div`min-height: 100vh; background: #faf7f2;`;

const Hero = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  padding: 3rem 0 5rem; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: -40%; right: -8%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%); }
`;

const HeroInner = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2;
  h1 { font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 0.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    span { background: linear-gradient(135deg, #818cf8, #a78bfa, #818cf8); background-size: 200% 200%;
      animation: ${gradShift} 3s ease infinite; -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text; } }
  p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin: 0; }
`;

const PeriodSelect = styled.select`
  background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px; padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; outline: none; margin-top: 1rem;
  option { background: #1a1a2e; color: white; }
`;

/* ═══ Stats ═══ */
const StatsStrip = styled.div`max-width: 1280px; margin: -2.5rem auto 0; padding: 0 2rem; position: relative; z-index: 10;`;
const StatsRow = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:500px){grid-template-columns:1fr;}`;
const StatBox = styled(motion.div)`
  background: white; border-radius: 16px; padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.04);
  display: flex; align-items: center; gap: 1rem;
`;
const StatIcn = styled.div`
  width: 48px; height: 48px; border-radius: 14px; background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  color: ${p => p.$c}; font-size: 1.2rem; flex-shrink: 0;
`;
const StatTxt = styled.div`
  .v { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; line-height: 1.2; }
  .l { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
`;

/* ═══ Main ═══ */
const Main = styled.div`max-width: 1280px; margin: 0 auto; padding: 2.5rem 2rem 4rem;`;
const Section = styled.h2`
  font-size: 1.3rem; font-weight: 800; color: #1a1a2e; margin: 0 0 1.5rem;
  display: flex; align-items: center; gap: 0.6rem; svg { color: #6366f1; }
`;

/* ═══ Revenue Chart ═══ */
const ChartCard = styled.div`
  background: white; border-radius: 20px; padding: 1.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.04);
  margin-bottom: 2rem;
`;
const ChartBars = styled.div`
  display: flex; align-items: flex-end; gap: 6px; height: 200px; padding-top: 1rem;
`;
const BarWrapper = styled.div`
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%;
  justify-content: flex-end;
`;
const Bar = styled(motion.div)`
  width: 100%; border-radius: 6px 6px 0 0; min-height: 4px;
  background: ${p => p.$active
        ? 'linear-gradient(to top, #6366f1, #818cf8)'
        : 'linear-gradient(to top, #e0e7ff, #c7d2fe)'};
  cursor: pointer; position: relative; transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;
const BarLabel = styled.div`
  font-size: 0.6rem; font-weight: 600;
  color: ${p => p.$active ? '#6366f1' : '#c0c0c0'};
`;
const BarValue = styled.div`
  font-size: 0.6rem; font-weight: 700; color: #6366f1;
  white-space: nowrap;
`;

/* ═══ Top Products ═══ */
const TopGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;
  margin-bottom: 2rem;
`;
const TopCard = styled(motion.div)`
  background: white; border-radius: 16px; padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.04);
  display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.07); }
`;
const Rank = styled.div`
  width: 36px; height: 36px; border-radius: 10px; display: flex;
  align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;
  background: ${p => p.$i === 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f5f5f5'};
  color: ${p => p.$i === 0 ? '#b45309' : '#6b7280'};
  flex-shrink: 0;
`;
const TPInfo = styled.div`
  flex: 1; min-width: 0;
  .name { font-weight: 700; color: #1a1a2e; font-size: 0.9rem; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; }
  .meta { font-size: 0.75rem; color: #9ca3af; }
`;
const TPRevenue = styled.div`
  font-size: 1.1rem; font-weight: 800; color: #1a1a2e; white-space: nowrap;
  .cur { font-size: 0.8rem; color: #6b7280; font-weight: 600; }
`;

/* ═══ Category breakdown ═══ */
const CatGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;
  margin-bottom: 2rem;
`;
const CatCard = styled(motion.div)`
  background: white; border-radius: 14px; padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.04);
  text-align: center; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); }
`;
const CatName = styled.div`font-size: 0.8rem; font-weight: 700; color: #6366f1; text-transform: capitalize; margin-bottom: 0.3rem;`;
const CatVal = styled.div`font-size: 1.5rem; font-weight: 800; color: #1a1a2e;`;
const CatSub = styled.div`font-size: 0.72rem; color: #9ca3af; font-weight: 500;`;

/* ═══ Skeleton ═══ */
const Skel = styled.div`
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%; animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${p => p.$r || '8px'}; height: ${p => p.$h || '14px'}; width: ${p => p.$w || '100%'};
`;

const EmptyBox = styled.div`
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 2px dashed #e5e7eb;
  svg { font-size: 2.5rem; color: #6366f1; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 0.5rem; }
  p { color: #9ca3af; margin: 0; }
`;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ═══ Component ═══ */
const SalesAnalytics = () => {
    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const [period, setPeriod] = useState('30');
    const [overview, setOverview] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [productPerf, setProductPerf] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [dashRes, salesRes, prodRes] = await Promise.all([
                    api.get('/analytics/dashboard', { params: { period } }),
                    api.get('/analytics/sales', { params: { period: 12 } }),
                    api.get('/analytics/products')
                ]);
                setOverview(dashRes.data.overview || {});
                setSalesData(salesRes.data.salesData || []);
                setProductPerf(prodRes.data.products || []);
            } catch (err) {
                console.error('Error fetching sales data:', err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchAll();
    }, [userId, period]);

    const currentMonth = new Date().getMonth();

    // Build category breakdown from product data
    const categories = {};
    productPerf.forEach(p => {
        if (!categories[p.category]) categories[p.category] = { count: 0, revenue: 0, views: 0 };
        categories[p.category].count++;
        categories[p.category].revenue += (p.price || 0) * (p.sales || 0);
        categories[p.category].views += p.views || 0;
    });

    // Build monthly chart data (last 12 months)
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mKey = `${d.getFullYear()}-${d.getMonth()}`;
        const match = salesData.find(s => s.month === mKey);
        chartData.push({
            month: MONTH_NAMES[d.getMonth()],
            revenue: match?.revenue || 0,
            orders: match?.orders || 0,
            isCurrent: i === 0
        });
    }
    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

    const totalRevenue = overview?.totalRevenue || 0;
    const totalOrders = overview?.totalOrders || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <h1><FiBarChart2 size={32} /> Sales <span>Analytics</span></h1>
                    <p>Track your revenue, orders, and product performance</p>
                    <PeriodSelect value={period} onChange={e => setPeriod(e.target.value)}>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last 12 months</option>
                    </PeriodSelect>
                </HeroInner>
            </Hero>

            <StatsStrip>
                <StatsRow>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <StatIcn $bg="linear-gradient(135deg,#e0e7ff,#c7d2fe)" $c="#6366f1"><FiDollarSign size={20} /></StatIcn>
                        <StatTxt><div className="v">{'\u20B9'}{totalRevenue.toLocaleString('en-IN')}</div><div className="l">Total Revenue</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fef3c7,#fde68a)" $c="#d97706"><FiShoppingCart size={20} /></StatIcn>
                        <StatTxt><div className="v">{totalOrders}</div><div className="l">Total Orders</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <StatIcn $bg="linear-gradient(135deg,#d1fae5,#a7f3d0)" $c="#059669"><FiTrendingUp size={20} /></StatIcn>
                        <StatTxt><div className="v">{'\u20B9'}{avgOrderValue.toLocaleString('en-IN')}</div><div className="l">Avg Order Value</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fce7f3,#fbcfe8)" $c="#db2777"><FiPackage size={20} /></StatIcn>
                        <StatTxt><div className="v">{overview?.activeProducts || productPerf.length}</div><div className="l">Active Products</div></StatTxt>
                    </StatBox>
                </StatsRow>
            </StatsStrip>

            <Main>
                {loading ? (
                    <>
                        <Skel $h="24px" $w="200px" style={{ marginBottom: 16 }} />
                        <ChartCard><Skel $h="200px" $r="12px" /></ChartCard>
                        <Skel $h="24px" $w="180px" style={{ marginBottom: 16 }} />
                        <TopGrid>{[1, 2, 3].map(i => <Skel key={i} $h="70px" $r="16px" />)}</TopGrid>
                    </>
                ) : (
                    <>
                        {/* Revenue Chart */}
                        <Section><FiTrendingUp /> Monthly Revenue</Section>
                        <ChartCard>
                            {chartData.some(d => d.revenue > 0) ? (
                                <>
                                    <ChartBars>
                                        {chartData.map((d, idx) => (
                                            <BarWrapper key={idx}>
                                                <BarValue>{d.revenue > 0 ? `${'\u20B9'}${(d.revenue / 1000).toFixed(1)}k` : ''}</BarValue>
                                                <Bar
                                                    $active={d.isCurrent}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.04 }}
                                                />
                                                <BarLabel $active={d.isCurrent}>{d.month}</BarLabel>
                                            </BarWrapper>
                                        ))}
                                    </ChartBars>
                                    <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: '#9ca3af' }}>
                                        <FiCalendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                        Last 12 months revenue breakdown
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                                    <FiBarChart2 size={32} style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ margin: 0 }}>No revenue data yet. Sales will appear here once orders are completed.</p>
                                </div>
                            )}
                        </ChartCard>

                        {/* Top Performing Products */}
                        <Section><FiStar /> Top Products</Section>
                        {productPerf.length > 0 ? (
                            <TopGrid>
                                {productPerf.slice(0, 6).map((p, i) => (
                                    <TopCard key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Rank $i={i}>{i + 1}</Rank>
                                        <TPInfo>
                                            <div className="name">{p.name}</div>
                                            <div className="meta">{p.sales || 0} sold &middot; {p.views || 0} views &middot; {'\u2B50'} {p.rating?.toFixed(1) || '0.0'}</div>
                                        </TPInfo>
                                        <TPRevenue><span className="cur">{'\u20B9'}</span>{((p.price || 0) * (p.sales || 0)).toLocaleString('en-IN')}</TPRevenue>
                                    </TopCard>
                                ))}
                            </TopGrid>
                        ) : (
                            <EmptyBox style={{ marginBottom: '2rem' }}>
                                <FiPackage /><h3>No product data yet</h3><p>Add products and make sales to see performance</p>
                            </EmptyBox>
                        )}

                        {/* Category Breakdown */}
                        {Object.keys(categories).length > 0 && (
                            <>
                                <Section><FiPackage /> Category Breakdown</Section>
                                <CatGrid>
                                    {Object.entries(categories).map(([cat, data], i) => (
                                        <CatCard key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                            <CatName>{cat}</CatName>
                                            <CatVal>{data.count}</CatVal>
                                            <CatSub>{data.count} product{data.count !== 1 ? 's' : ''} &middot; {data.views} views</CatSub>
                                        </CatCard>
                                    ))}
                                </CatGrid>
                            </>
                        )}
                    </>
                )}
            </Main>
        </Page>
    );
};

export default SalesAnalytics;
