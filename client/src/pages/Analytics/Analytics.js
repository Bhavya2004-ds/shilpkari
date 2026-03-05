import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp, FiPackage, FiBarChart2, FiRefreshCw,
  FiChevronRight, FiAlertCircle, FiCheckCircle,
  FiActivity, FiZap, FiStar, FiEye, FiShoppingCart,
  FiArrowUp, FiArrowDown, FiCalendar
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

/* ═══════════════════ Animations ═══════════════════ */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(217,119,6,0.3); }
  70% { box-shadow: 0 0 0 10px rgba(217,119,6,0); }
  100% { box-shadow: 0 0 0 0 rgba(217,119,6,0); }
`;
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ═══════════════════ Layout ═══════════════════ */
const Page = styled.div`
  min-height: 100vh;
  background: #faf7f2;
`;

const Hero = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  padding: 3rem 0 5rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -8%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%);
  }
`;

const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    span {
      background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
      background-size: 200% 200%;
      animation: ${gradientShift} 3s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin: 0; }
`;

/* ═══════════════════ Stats ═══════════════════ */
const StatsStrip = styled.div`
  max-width: 1280px;
  margin: -2.5rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Stat = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const StatText = styled.div`
  .val { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; line-height: 1.2; }
  .lbl { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
`;

/* ═══════════════════ Main ═══════════════════ */
const Main = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  svg { color: #d97706; }
`;

/* ═══════════════════ Demand Cards Grid ═══════════════════ */
const DemandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`;

const DemandCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
`;

const DemandCardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f5f5f5;
`;

const ProductThumb = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ProductMeta = styled.div`
  flex: 1;
  min-width: 0;
  .name {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cat {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #d97706;
  }
`;

const ForecastBtn = styled.button`
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  border: none;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  ${p => p.$loading ? css`
    background: #f5f5f5;
    color: #9ca3af;
    cursor: wait;
  ` : css`
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;
    box-shadow: 0 2px 8px rgba(217,119,6,0.3);
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(217,119,6,0.4); }
  `}
`;

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const DemandCardBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const ForecastResult = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ForecastMetric = styled.div`
  background: ${p => p.$bg || '#f9fafb'};
  border-radius: 12px;
  padding: 0.85rem;
  text-align: center;
  border: 1px solid ${p => p.$border || '#f3f4f6'};

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${p => p.$valueColor || '#1a1a2e'};
    line-height: 1.2;
  }
  .label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #9ca3af;
    margin-top: 0.2rem;
  }
`;

/* Seasonality mini-chart */
const SeasonChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 50px;
  padding-top: 0.5rem;
`;

const SeasonBar = styled.div`
  flex: 1;
  border-radius: 3px 3px 0 0;
  background: ${p => p.$active
    ? 'linear-gradient(to top, #d97706, #f59e0b)'
    : 'linear-gradient(to top, #e5e7eb, #f3f4f6)'};
  height: ${p => p.$h}%;
  min-height: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    opacity: 0.8;
  }
`;

const MonthLabels = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 4px;
  div {
    flex: 1;
    text-align: center;
    font-size: 0.55rem;
    color: ${p => p.$active ? '#d97706' : '#c0c0c0'};
    font-weight: 600;
  }
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.75rem;
`;

const ConfidenceFill = styled(motion.div)`
  height: 100%;
  border-radius: 3px;
  background: ${p => {
    if (p.$pct > 70) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (p.$pct > 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  }};
`;

const ConfidenceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
  margin-top: 0.35rem;

  strong {
    color: ${p => {
    if (p.$pct > 70) return '#059669';
    if (p.$pct > 40) return '#d97706';
    return '#dc2626';
  }};
  }
`;

const NoForecast = styled.div`
  text-align: center;
  padding: 1.5rem 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
  svg { font-size: 1.5rem; margin-bottom: 0.5rem; display: block; margin: 0 auto 0.5rem; color: #d1d5db; }
  p { margin: 0; }
`;

/* ═══════════════════ Insights Section ═══════════════════ */
const InsightCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
`;

const InsightCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border-left: 4px solid ${p => p.$accent || '#d97706'};
`;

const InsightTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${p => p.$color || '#d97706'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const InsightValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
`;

const InsightDesc = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

/* ═══════════════════ Empty state ═══════════════════ */
const EmptyBox = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 2px dashed #e5e7eb;

  svg { font-size: 2.5rem; color: #d97706; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 0.5rem; }
  p { color: #9ca3af; margin: 0; }
`;

/* ═══════════════════ Skeleton ═══════════════════ */
const Skel = styled.div`
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${p => p.$r || '8px'};
  height: ${p => p.$h || '14px'};
  width: ${p => p.$w || '100%'};
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ═══════════════════ Component ═══════════════════ */
const Analytics = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState({});      // productId -> forecast data
  const [loadingForecast, setLoadingForecast] = useState({}); // productId -> bool
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artisan's products with their existing forecast data
        const prodRes = await api.get('/products', {
          params: { artisan: userId, limit: 100 }
        });
        const prods = prodRes.data.products || [];
        setProducts(prods);

        // Pre-populate forecasts from existing data
        const existing = {};
        prods.forEach(p => {
          if (p.demandForecast && p.demandForecast.predictedDemand) {
            existing[p._id] = p.demandForecast;
          }
        });
        setForecasts(existing);

        // Fetch AI insights
        try {
          const insRes = await api.get(`/ai/insights/${userId}`);
          setInsights(insRes.data);
        } catch (e) {
          // insights endpoint may fail if no data, that's ok
          console.log('Could not fetch insights:', e.message);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  const runForecast = async (productId) => {
    setLoadingForecast(prev => ({ ...prev, [productId]: true }));
    try {
      const res = await api.post('/ai/demand-forecast', {
        productId,
        timeHorizon: 30
      });
      setForecasts(prev => ({ ...prev, [productId]: res.data }));
      toast.success('Demand forecast generated!');
    } catch (err) {
      toast.error('Failed to generate forecast');
    } finally {
      setLoadingForecast(prev => ({ ...prev, [productId]: false }));
    }
  };

  const runAllForecasts = async () => {
    for (const p of products) {
      await runForecast(p._id);
    }
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (typeof img === 'object' && img.url) return img.url;
      if (typeof img === 'string') return img;
    }
    return null;
  };

  const totalPredicted = Object.values(forecasts).reduce((s, f) => s + (f.predictedDemand || 0), 0);
  const avgConfidence = Object.values(forecasts).length > 0
    ? Object.values(forecasts).reduce((s, f) => s + (f.confidence || 0), 0) / Object.values(forecasts).length
    : 0;
  const forecastCount = Object.keys(forecasts).length;
  const currentMonth = new Date().getMonth();

  return (
    <Page>
      <Hero>
        <HeroInner>
          <h1>
            <FiTrendingUp size={32} />
            Demand <span>Prediction</span>
          </h1>
          <p>AI-powered demand forecasting for your artisan products</p>
        </HeroInner>
      </Hero>

      {/* Stats Strip */}
      <StatsStrip>
        <StatsRow>
          <Stat initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatIcon $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
              <FiPackage size={20} />
            </StatIcon>
            <StatText>
              <div className="val">{products.length}</div>
              <div className="lbl">Products</div>
            </StatText>
          </Stat>
          <Stat initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatIcon $bg="linear-gradient(135deg, #dbeafe, #bfdbfe)" $color="#2563eb">
              <FiBarChart2 size={20} />
            </StatIcon>
            <StatText>
              <div className="val">{forecastCount}</div>
              <div className="lbl">Forecasted</div>
            </StatText>
          </Stat>
          <Stat initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatIcon $bg="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#059669">
              <FiTrendingUp size={20} />
            </StatIcon>
            <StatText>
              <div className="val">{totalPredicted}</div>
              <div className="lbl">Total Demand</div>
            </StatText>
          </Stat>
          <Stat initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <StatIcon $bg="linear-gradient(135deg, #fce7f3, #fbcfe8)" $color="#db2777">
              <FiActivity size={20} />
            </StatIcon>
            <StatText>
              <div className="val">{Math.round(avgConfidence * 100)}%</div>
              <div className="lbl">Avg Confidence</div>
            </StatText>
          </Stat>
        </StatsRow>
      </StatsStrip>

      <Main>
        {/* AI Insights Row */}
        {insights && (
          <>
            <SectionTitle><FiZap /> AI Insights</SectionTitle>
            <InsightCards>
              <InsightCard
                $accent="#10b981"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <InsightTitle $color="#059669"><FiCheckCircle /> Quality Score</InsightTitle>
                <InsightValue>{insights.averageQualityScore || 0}%</InsightValue>
                <InsightDesc>Average product quality across {insights.totalProducts} products</InsightDesc>
              </InsightCard>
              <InsightCard
                $accent="#2563eb"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <InsightTitle $color="#2563eb"><FiShoppingCart /> Recent Sales</InsightTitle>
                <InsightValue>{'\u20B9'}{(insights.totalSales || 0).toLocaleString('en-IN')}</InsightValue>
                <InsightDesc>{insights.recentOrdersCount || 0} orders in the last 30 days</InsightDesc>
              </InsightCard>
              <InsightCard
                $accent="#d97706"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <InsightTitle $color="#d97706"><FiStar /> Approved Products</InsightTitle>
                <InsightValue>{insights.approvedProducts || 0}/{insights.totalProducts || 0}</InsightValue>
                <InsightDesc>Products passing AI quality checks</InsightDesc>
              </InsightCard>
            </InsightCards>
          </>
        )}

        {/* Demand Forecast Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <SectionTitle style={{ margin: 0 }}><FiBarChart2 /> Product Demand Forecasts</SectionTitle>
          {products.length > 0 && (
            <ForecastBtn onClick={runAllForecasts} $loading={Object.values(loadingForecast).some(v => v)}>
              <FiRefreshCw size={14} /> Forecast All
            </ForecastBtn>
          )}
        </div>

        {loading ? (
          <DemandGrid>
            {[1, 2, 3].map(i => (
              <DemandCard key={i}>
                <DemandCardHeader>
                  <Skel $w="50px" $h="50px" $r="12px" />
                  <div style={{ flex: 1 }}>
                    <Skel $w="60%" $h="12px" style={{ marginBottom: 6 }} />
                    <Skel $w="30%" $h="10px" />
                  </div>
                </DemandCardHeader>
                <DemandCardBody>
                  <Skel $h="80px" $r="12px" />
                </DemandCardBody>
              </DemandCard>
            ))}
          </DemandGrid>
        ) : products.length > 0 ? (
          <DemandGrid>
            <AnimatePresence>
              {products.map((product, i) => {
                const forecast = forecasts[product._id];
                const confPct = Math.round((forecast?.confidence || 0) * 100);
                const seasonality = forecast?.seasonality || [];
                const maxSeason = Math.max(...(seasonality.length > 0 ? seasonality : [1]));

                return (
                  <DemandCard
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <DemandCardHeader>
                      <ProductThumb>
                        {getImageUrl(product) ? (
                          <img src={getImageUrl(product)} alt={product.name} />
                        ) : (
                          <FiPackage size={20} color="#d97706" />
                        )}
                      </ProductThumb>
                      <ProductMeta>
                        <div className="name">{product.name}</div>
                        <div className="cat">{product.category} &bull; {'\u20B9'}{product.price?.toLocaleString('en-IN')}</div>
                      </ProductMeta>
                      <ForecastBtn
                        onClick={() => runForecast(product._id)}
                        $loading={loadingForecast[product._id]}
                        disabled={loadingForecast[product._id]}
                      >
                        {loadingForecast[product._id] ? (
                          <><Spinner /> Running</>
                        ) : (
                          <><FiZap size={12} /> Predict</>
                        )}
                      </ForecastBtn>
                    </DemandCardHeader>

                    <DemandCardBody>
                      {forecast ? (
                        <>
                          <ForecastResult>
                            <ForecastMetric
                              $bg="linear-gradient(135deg, #fef3c7, #fffbeb)"
                              $border="rgba(217,119,6,0.15)"
                              $valueColor="#b45309"
                            >
                              <div className="value">{forecast.predictedDemand}</div>
                              <div className="label">Units / Month</div>
                            </ForecastMetric>
                            <ForecastMetric
                              $bg={confPct > 60 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)'}
                              $border={confPct > 60 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}
                              $valueColor={confPct > 60 ? '#059669' : '#dc2626'}
                            >
                              <div className="value">{confPct}%</div>
                              <div className="label">Confidence</div>
                            </ForecastMetric>
                          </ForecastResult>

                          {/* Seasonality Chart */}
                          {seasonality.length > 0 && (
                            <>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.3rem' }}>
                                <FiCalendar size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Monthly Seasonality
                              </div>
                              <SeasonChart>
                                {seasonality.map((val, idx) => (
                                  <SeasonBar
                                    key={idx}
                                    $h={(val / maxSeason) * 100}
                                    $active={idx === currentMonth}
                                    title={`${MONTHS[idx]}: ${val.toFixed(1)}x`}
                                  />
                                ))}
                              </SeasonChart>
                              <MonthLabels>
                                {MONTHS.map((m, idx) => (
                                  <div key={m} style={{ fontWeight: idx === currentMonth ? 700 : 500, color: idx === currentMonth ? '#d97706' : '#c0c0c0' }}>
                                    {m[0]}
                                  </div>
                                ))}
                              </MonthLabels>
                            </>
                          )}

                          {/* Confidence bar */}
                          <ConfidenceBar>
                            <ConfidenceFill
                              $pct={confPct}
                              initial={{ width: 0 }}
                              animate={{ width: `${confPct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </ConfidenceBar>
                          <ConfidenceLabel $pct={confPct}>
                            <span>Model confidence</span>
                            <strong>{confPct}%</strong>
                          </ConfidenceLabel>

                          {forecast.message && (
                            <div style={{
                              marginTop: '0.75rem',
                              padding: '0.6rem 0.85rem',
                              background: '#fffbeb',
                              borderRadius: 10,
                              fontSize: '0.78rem',
                              color: '#92400e',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}>
                              <FiAlertCircle size={14} />
                              {forecast.message}
                            </div>
                          )}
                        </>
                      ) : (
                        <NoForecast>
                          <FiBarChart2 />
                          <p>Click <strong>Predict</strong> to generate demand forecast</p>
                        </NoForecast>
                      )}
                    </DemandCardBody>
                  </DemandCard>
                );
              })}
            </AnimatePresence>
          </DemandGrid>
        ) : (
          <EmptyBox>
            <FiPackage />
            <h3>No products found</h3>
            <p>Add products to your shop to start getting demand predictions</p>
          </EmptyBox>
        )}
      </Main>
    </Page>
  );
};

export default Analytics;
