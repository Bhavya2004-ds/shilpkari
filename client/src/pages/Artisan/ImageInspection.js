import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCamera, FiPackage, FiCheckCircle, FiXCircle, FiRefreshCw,
    FiAlertTriangle, FiZap, FiSun, FiGrid, FiMaximize,
    FiImage, FiTarget, FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

/* ═══════════ Animations ═══════════ */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const scanLine = keyframes`
  0% { top: 0; }
  50% { top: calc(100% - 3px); }
  100% { top: 0; }
`;

/* ═══════════ Layout ═══════════ */
const Page = styled.div`min-height: 100vh; background: #faf7f2;`;

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
    background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);
  }
`;

const HeroInner = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2;
  h1 {
    font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 0.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    span {
      background: linear-gradient(135deg, #10b981, #34d399, #10b981);
      background-size: 200% 200%;
      animation: ${gradientShift} 3s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin: 0; }
`;

/* ═══════════ Stats ═══════════ */
const StatsStrip = styled.div`
  max-width: 1280px; margin: -2.5rem auto 0; padding: 0 2rem; position: relative; z-index: 10;
`;
const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;
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

/* ═══════════ Main ═══════════ */
const Main = styled.div`max-width: 1280px; margin: 0 auto; padding: 2.5rem 2rem 4rem;`;

const ToolbarRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem; font-weight: 800; color: #1a1a2e; margin: 0;
  display: flex; align-items: center; gap: 0.6rem;
  svg { color: #10b981; }
`;

const InspectAllBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; border: none; border-radius: 14px;
  font-weight: 700; font-size: 0.9rem; cursor: pointer;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white; box-shadow: 0 4px 20px rgba(16,185,129,0.3);
  transition: all 0.3s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(16,185,129,0.4); }
  &:disabled { opacity: 0.6; cursor: wait; transform: none; }
`;

const Spinner = styled.div`
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: ${spin} 0.6s linear infinite;
`;

/* ═══════════ Product Cards ═══════════ */
const Cards = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem;
  @media (max-width: 450px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
`;

const CardTop = styled.div`
  display: flex; gap: 1rem; padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f5f5f5; align-items: center;
`;

const ImgWrap = styled.div`
  width: 72px; height: 72px; border-radius: 14px; overflow: hidden;
  background: linear-gradient(135deg, #f8f4ec, #f0e6d3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ScanOverlay = styled.div`
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #10b981, transparent);
    animation: ${scanLine} 1.5s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(16,185,129,0.6);
  }
`;

const ProdInfo = styled.div`
  flex: 1; min-width: 0;
  .name { font-weight: 700; color: #1a1a2e; font-size: 0.95rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat { font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; color: #10b981; }
  .imgs { font-size: 0.78rem; color: #9ca3af; margin-top: 0.15rem; }
`;

const InspectBtn = styled.button`
  padding: 0.45rem 0.9rem; border-radius: 10px; border: none;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex;
  align-items: center; gap: 0.35rem; transition: all 0.2s ease;
  ${p => p.$loading ? css`
    background: #f5f5f5; color: #9ca3af; cursor: wait;
  ` : css`
    background: linear-gradient(135deg, #10b981, #059669);
    color: white; box-shadow: 0 2px 8px rgba(16,185,129,0.3);
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(16,185,129,0.4); }
  `}
`;

/* ── Results area ── */
const ResultArea = styled.div`padding: 1.25rem 1.5rem;`;

const ScoreRing = styled.div`
  width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 1rem;
  display: flex; align-items: center; justify-content: center;
  background: conic-gradient(
    ${p => p.$color} ${p => p.$pct * 3.6}deg,
    #f3f4f6 ${p => p.$pct * 3.6}deg
  );
  position: relative;
`;

const ScoreInner = styled.div`
  width: 80px; height: 80px; border-radius: 50%;
  background: white; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  .num { font-size: 1.5rem; font-weight: 800; color: ${p => p.$color}; line-height: 1; }
  .txt { font-size: 0.6rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
`;

const ApprovalBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.85rem; border-radius: 10px; font-size: 0.75rem;
  font-weight: 700; text-align: center; margin: 0 auto 1rem; display: flex; justify-content: center; width: fit-content;
  ${p => p.$ok ? css`
    background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;
  ` : css`
    background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;
  `}
`;

/* Sub-score bars */
const SubScores = styled.div`
  display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem;
`;

const SubRow = styled.div`
  display: flex; align-items: center; gap: 0.6rem;
`;

const SubLabel = styled.div`
  width: 100px; font-size: 0.78rem; font-weight: 600; color: #6b7280;
  display: flex; align-items: center; gap: 0.3rem;
  svg { color: ${p => p.$color || '#9ca3af'}; flex-shrink: 0; }
`;

const SubBarTrack = styled.div`
  flex: 1; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;
`;

const SubBarFill = styled(motion.div)`
  height: 100%; border-radius: 4px;
  background: ${p => {
        if (p.$v >= 85) return 'linear-gradient(90deg, #10b981, #34d399)';
        if (p.$v >= 75) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        return 'linear-gradient(90deg, #ef4444, #f87171)';
    }};
`;

const SubVal = styled.div`
  width: 32px; text-align: right; font-size: 0.75rem; font-weight: 700;
  color: ${p => {
        if (p.$v >= 85) return '#059669';
        if (p.$v >= 75) return '#d97706';
        return '#dc2626';
    }};
`;

/* Issues & recommendations */
const FeedbackList = styled.div`margin-top: 0.75rem;`;

const FeedbackItem = styled.div`
  display: flex; align-items: flex-start; gap: 0.5rem;
  padding: 0.5rem 0.65rem; margin-bottom: 0.4rem;
  border-radius: 10px; font-size: 0.8rem; line-height: 1.4;
  background: ${p => p.$type === 'issue' ? '#fef2f2' : '#ecfdf5'};
  color: ${p => p.$type === 'issue' ? '#991b1b' : '#065f46'};
  svg { flex-shrink: 0; margin-top: 2px; }
`;

const NoResult = styled.div`
  text-align: center; padding: 2rem 1rem; color: #9ca3af; font-size: 0.9rem;
  svg { font-size: 1.5rem; margin-bottom: 0.5rem; display: block; margin: 0 auto 0.5rem; color: #d1d5db; }
  p { margin: 0; }
`;

const EmptyBox = styled.div`
  text-align: center; padding: 4rem 2rem; background: white;
  border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 2px dashed #e5e7eb;
  svg { font-size: 2.5rem; color: #10b981; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 0.5rem; }
  p { color: #9ca3af; margin: 0; }
`;

const Skel = styled.div`
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%; animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${p => p.$r || '8px'}; height: ${p => p.$h || '14px'}; width: ${p => p.$w || '100%'};
`;

const SUB_META = [
    { key: 'resolution', label: 'Resolution', icon: FiMaximize, color: '#3b82f6' },
    { key: 'lighting', label: 'Lighting', icon: FiSun, color: '#f59e0b' },
    { key: 'composition', label: 'Composition', icon: FiGrid, color: '#8b5cf6' },
    { key: 'background', label: 'Background', icon: FiImage, color: '#06b6d4' },
    { key: 'sharpness', label: 'Sharpness', icon: FiTarget, color: '#ec4899' },
];

/* ═══════════ Component ═══════════ */
const ImageInspection = () => {
    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({}); // productId -> quality data
    const [inspecting, setInspecting] = useState({}); // productId -> bool

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/products', { params: { artisan: userId, limit: 100 } });
                const prods = res.data.products || [];
                setProducts(prods);

                // Pre-populate from existing qualityCheck data
                const existing = {};
                prods.forEach(p => {
                    if (p.qualityCheck && p.qualityCheck.score) {
                        existing[p._id] = p.qualityCheck;
                    }
                });
                setResults(existing);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetch();
    }, [userId]);

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            if (typeof img === 'object' && img.url) return img.url;
            if (typeof img === 'string') return img;
        }
        return null;
    };

    const inspect = async (product) => {
        setInspecting(p => ({ ...p, [product._id]: true }));
        try {
            const imageUrl = getImageUrl(product);
            const res = await api.post('/ai/quality-check', {
                productId: product._id,
                imageUrl: imageUrl || ''
            });
            setResults(p => ({ ...p, [product._id]: res.data }));
            toast.success(`Inspection complete for "${product.name}"`);
        } catch (err) {
            toast.error('Inspection failed');
        } finally {
            setInspecting(p => ({ ...p, [product._id]: false }));
        }
    };

    const inspectAll = async () => {
        for (const p of products) {
            await inspect(p);
        }
    };

    const getScoreColor = (s) => {
        if (s >= 85) return '#10b981';
        if (s >= 75) return '#f59e0b';
        return '#ef4444';
    };

    const totalInspected = Object.keys(results).length;
    const approved = Object.values(results).filter(r => r.isApproved || (r.score && r.score >= 75)).length;
    const avgScore = totalInspected > 0
        ? Math.round(Object.values(results).reduce((s, r) => s + (r.qualityScore || r.score || 0), 0) / totalInspected)
        : 0;
    const anyRunning = Object.values(inspecting).some(Boolean);

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <h1><FiCamera size={32} /> Image <span>Inspection</span></h1>
                    <p>AI-powered quality analysis for your product photography</p>
                </HeroInner>
            </Hero>

            <StatsStrip>
                <StatsRow>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fef3c7,#fde68a)" $c="#d97706"><FiPackage size={20} /></StatIcn>
                        <StatTxt><div className="v">{products.length}</div><div className="l">Products</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <StatIcn $bg="linear-gradient(135deg,#dbeafe,#bfdbfe)" $c="#2563eb"><FiCamera size={20} /></StatIcn>
                        <StatTxt><div className="v">{totalInspected}</div><div className="l">Inspected</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <StatIcn $bg="linear-gradient(135deg,#d1fae5,#a7f3d0)" $c="#059669"><FiCheckCircle size={20} /></StatIcn>
                        <StatTxt><div className="v">{approved}</div><div className="l">Approved</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fce7f3,#fbcfe8)" $c="#db2777"><FiZap size={20} /></StatIcn>
                        <StatTxt><div className="v">{avgScore}%</div><div className="l">Avg Score</div></StatTxt>
                    </StatBox>
                </StatsRow>
            </StatsStrip>

            <Main>
                <ToolbarRow>
                    <SectionTitle><FiCamera /> Product Image Quality</SectionTitle>
                    {products.length > 0 && (
                        <InspectAllBtn onClick={inspectAll} disabled={anyRunning}>
                            {anyRunning ? <><Spinner /> Inspecting...</> : <><FiRefreshCw size={15} /> Inspect All Products</>}
                        </InspectAllBtn>
                    )}
                </ToolbarRow>

                {loading ? (
                    <Cards>
                        {[1, 2, 3].map(i => (
                            <Card key={i}>
                                <CardTop>
                                    <Skel $w="72px" $h="72px" $r="14px" />
                                    <div style={{ flex: 1 }}>
                                        <Skel $w="60%" $h="12px" style={{ marginBottom: 6 }} />
                                        <Skel $w="35%" $h="10px" />
                                    </div>
                                </CardTop>
                                <ResultArea><Skel $h="120px" $r="12px" /></ResultArea>
                            </Card>
                        ))}
                    </Cards>
                ) : products.length > 0 ? (
                    <Cards>
                        <AnimatePresence>
                            {products.map((product, i) => {
                                const r = results[product._id];
                                const score = r?.qualityScore || r?.score || 0;
                                const subs = r?.subScores || {};
                                const isRunning = inspecting[product._id];
                                const imgUrl = getImageUrl(product);
                                const imgCount = product.images?.length || 0;

                                return (
                                    <Card
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <CardTop>
                                            <ImgWrap>
                                                {imgUrl ? <img src={imgUrl} alt={product.name} /> : <FiPackage size={24} color="#d4a574" />}
                                                {isRunning && <ScanOverlay />}
                                            </ImgWrap>
                                            <ProdInfo>
                                                <div className="cat">{product.category}</div>
                                                <div className="name">{product.name}</div>
                                                <div className="imgs">{imgCount} image{imgCount !== 1 ? 's' : ''}</div>
                                            </ProdInfo>
                                            <InspectBtn
                                                onClick={() => inspect(product)}
                                                $loading={isRunning}
                                                disabled={isRunning}
                                            >
                                                {isRunning ? <><Spinner /> Scanning</> : <><FiZap size={12} /> Inspect</>}
                                            </InspectBtn>
                                        </CardTop>

                                        <ResultArea>
                                            {r ? (
                                                <>
                                                    {/* Score ring */}
                                                    <ScoreRing $pct={score} $color={getScoreColor(score)}>
                                                        <ScoreInner $color={getScoreColor(score)}>
                                                            <div className="num">{score}</div>
                                                            <div className="txt">Score</div>
                                                        </ScoreInner>
                                                    </ScoreRing>

                                                    <ApprovalBadge $ok={r.isApproved || score >= 75}>
                                                        {(r.isApproved || score >= 75)
                                                            ? <><FiCheckCircle size={14} /> Approved</>
                                                            : <><FiXCircle size={14} /> Needs Improvement</>}
                                                    </ApprovalBadge>

                                                    {/* Sub-scores */}
                                                    {Object.keys(subs).length > 0 && (
                                                        <SubScores>
                                                            {SUB_META.map(({ key, label, icon: Icon, color }) => {
                                                                const v = subs[key];
                                                                if (v === undefined) return null;
                                                                return (
                                                                    <SubRow key={key}>
                                                                        <SubLabel $color={color}><Icon size={13} /> {label}</SubLabel>
                                                                        <SubBarTrack>
                                                                            <SubBarFill
                                                                                $v={v}
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${v}%` }}
                                                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                                            />
                                                                        </SubBarTrack>
                                                                        <SubVal $v={v}>{v}%</SubVal>
                                                                    </SubRow>
                                                                );
                                                            })}
                                                        </SubScores>
                                                    )}

                                                    {/* Issues */}
                                                    {r.issues && r.issues.length > 0 && (
                                                        <FeedbackList>
                                                            {r.issues.map((issue, idx) => (
                                                                <FeedbackItem key={idx} $type="issue">
                                                                    <FiAlertTriangle size={13} /> {issue}
                                                                </FeedbackItem>
                                                            ))}
                                                        </FeedbackList>
                                                    )}

                                                    {/* Recommendations */}
                                                    {r.recommendations && r.recommendations.length > 0 && (
                                                        <FeedbackList>
                                                            {r.recommendations.map((rec, idx) => (
                                                                <FeedbackItem key={idx} $type="rec">
                                                                    <FiArrowRight size={13} /> {rec}
                                                                </FeedbackItem>
                                                            ))}
                                                        </FeedbackList>
                                                    )}
                                                </>
                                            ) : (
                                                <NoResult>
                                                    <FiCamera />
                                                    <p>Click <strong>Inspect</strong> to analyze image quality</p>
                                                </NoResult>
                                            )}
                                        </ResultArea>
                                    </Card>
                                );
                            })}
                        </AnimatePresence>
                    </Cards>
                ) : (
                    <EmptyBox>
                        <FiPackage />
                        <h3>No products found</h3>
                        <p>Add products with images to start quality inspection</p>
                    </EmptyBox>
                )}
            </Main>
        </Page>
    );
};

export default ImageInspection;
