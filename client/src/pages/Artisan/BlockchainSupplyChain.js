import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiLink, FiShield, FiCheckCircle, FiXCircle, FiPackage,
    FiTruck, FiClock, FiMapPin, FiSearch, FiX, FiPlus,
    FiHash, FiLock, FiChevronDown, FiChevronUp, FiAlertCircle,
    FiBox, FiSend, FiRefreshCw, FiEye
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

/* ═══════ Animations ═══════ */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const gradShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

const hexFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
  50% { transform: translateY(-10px) rotate(5deg); opacity: 0.25; }
`;

/* ═══════ Layout ═══════ */
const Page = styled.div`min-height: 100vh; background: #faf7f2;`;

const Hero = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%);
  padding: 3rem 0 5rem; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: -40%; right: -5%; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%); }
  &::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%); }
`;

const HeroBg = styled.div`
  position: absolute; inset: 0; overflow: hidden; z-index: 0;
`;
const HexBlock = styled.div`
  position: absolute; font-family: monospace; font-size: 0.6rem; color: rgba(34,211,238,0.1);
  letter-spacing: 2px; white-space: nowrap;
  animation: ${hexFloat} ${p => p.$d || 4}s ease-in-out infinite;
  animation-delay: ${p => p.$del || 0}s;
  top: ${p => p.$t || '20%'}; left: ${p => p.$l || '10%'};
`;

const HeroInner = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2;
  h1 { font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 0.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    span { background: linear-gradient(135deg, #22d3ee, #a78bfa, #22d3ee); background-size: 200% 200%;
      animation: ${gradShift} 3s ease infinite; -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text; } }
  p { color: rgba(255,255,255,0.5); font-size: 1.1rem; margin: 0; }
`;

/* ═══════ Stats ═══════ */
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
  color: ${p => p.$c}; flex-shrink: 0;
`;
const StatTxt = styled.div`
  .v { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; line-height: 1.2; }
  .l { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
`;

/* ═══════ Main ═══════ */
const Main = styled.div`max-width: 1280px; margin: 0 auto; padding: 2.5rem 2rem 4rem;`;
const Section = styled.h2`
  font-size: 1.3rem; font-weight: 800; color: #1a1a2e; margin: 0 0 1.5rem;
  display: flex; align-items: center; gap: 0.6rem; svg { color: #22d3ee; }
`;

const Toolbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`;
const SearchBox = styled.div`
  display: flex; align-items: center; gap: 0.75rem; background: white;
  border: 2px solid #eee; border-radius: 14px; padding: 0.7rem 1.15rem;
  min-width: 280px; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  &:focus-within { border-color: #22d3ee; box-shadow: 0 0 0 4px rgba(34,211,238,0.08); }
  svg { color: #b0b0b0; flex-shrink: 0; }
  input { flex: 1; border: none; outline: none; font-size: 0.95rem; color: #1f2937; background: transparent;
    font-weight: 500; &::placeholder { color: #c0c0c0; } }
  @media (max-width: 600px) { min-width: 100%; }
`;

const Spinner = styled.div`
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: ${spin} 0.6s linear infinite;
`;

/* ═══════ Order blockchain cards ═══════ */
const Cards = styled.div`display: flex; flex-direction: column; gap: 1.25rem;`;

const Card = styled(motion.div)`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  &:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem; display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  cursor: pointer; transition: background 0.2s;
  &:hover { background: #fafafa; }
`;

const OrderMeta = styled.div`
  .num { font-weight: 800; color: #1a1a2e; font-size: 1rem; display: flex; align-items: center; gap: 0.4rem; }
  .date { font-size: 0.78rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; margin-top: 0.15rem; }
`;

const BadgeRow = styled.div`display: flex; align-items: center; gap: 0.75rem;`;

const VerifiedBadge = styled.div`
  display: flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.85rem;
  border-radius: 10px; font-size: 0.73rem; font-weight: 700;
  ${p => p.$ok ? css`
    background: linear-gradient(135deg, #ecfdf5, #d1fae5); color: #065f46; border: 1px solid #a7f3d0;
  ` : css`
    background: #f9fafb; color: #9ca3af; border: 1px solid #e5e7eb;
  `}
`;

const StatusBadge = styled.div`
  padding: 0.3rem 0.75rem; border-radius: 10px; font-size: 0.73rem;
  font-weight: 700; text-transform: capitalize;
  ${p => {
        switch (p.$s) {
            case 'delivered': return css`background: #ecfdf5; color: #065f46;`;
            case 'shipped': return css`background: #dbeafe; color: #1e40af;`;
            case 'processing': return css`background: #fef3c7; color: #92400e;`;
            case 'cancelled': return css`background: #fef2f2; color: #991b1b;`;
            default: return css`background: #f5f5f5; color: #6b7280;`;
        }
    }}
`;

const ExpandIcon = styled.div`
  width: 32px; height: 32px; border-radius: 8px; background: #f5f5f5;
  display: flex; align-items: center; justify-content: center; color: #9ca3af;
`;

/* ═══════ Expanded body ═══════ */
const CardBody = styled(motion.div)`border-top: 1px solid #f3f4f6;`;

/* Blockchain info bar */
const BlockchainInfo = styled.div`
  padding: 1rem 1.5rem; background: linear-gradient(135deg, #f0fdfa, #ecfdf5);
  border-bottom: 1px solid #d1fae5;
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
`;
const HashBadge = styled.div`
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.75rem; border-radius: 8px; font-size: 0.72rem;
  font-weight: 600; font-family: 'Courier New', monospace;
  background: rgba(0,0,0,0.04); color: #374151;
  max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  svg { flex-shrink: 0; color: #22d3ee; }
`;
const BlockNum = styled.div`
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.75rem; font-weight: 600; color: #6b7280;
  svg { color: #a78bfa; }
`;

/* Supply chain timeline */
const TimelineWrap = styled.div`padding: 1.5rem;`;
const TimelineLabel = styled.h4`
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: #9ca3af; margin: 0 0 1.25rem;
  display: flex; align-items: center; gap: 0.4rem;
`;

const TimelineItem = styled.div`
  display: flex; gap: 1rem; position: relative;
  &:last-child .tl-line { display: none; }
`;
const TLDot = styled.div`
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 2; font-size: 0.8rem;
  ${p => p.$verified ? css`
    background: linear-gradient(135deg, #22d3ee, #06b6d4);
    color: white; box-shadow: 0 2px 10px rgba(34,211,238,0.3);
  ` : p.$active ? css`
    background: #a78bfa; color: white;
    animation: ${pulse} 2s ease-in-out infinite;
  ` : css`
    background: #f3f4f6; color: #9ca3af;
  `}
`;
const TLLine = styled.div`
  position: absolute; left: 15px; top: 32px; bottom: -8px; width: 2px;
  background: ${p => p.$verified
        ? 'linear-gradient(to bottom, #22d3ee, #e5e7eb)'
        : '#e5e7eb'};
`;
const TLContent = styled.div`
  flex: 1; padding-bottom: 1.25rem;
  .stage { font-weight: 700; color: #1a1a2e; font-size: 0.88rem;
    text-transform: capitalize; display: flex; align-items: center; gap: 0.4rem; }
  .desc { font-size: 0.8rem; color: #6b7280; margin-top: 0.15rem; }
  .meta { font-size: 0.72rem; color: #9ca3af; margin-top: 0.2rem;
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
`;
const VerifyTag = styled.span`
  font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.5rem;
  border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;
  ${p => p.$v ? css`
    background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;
  ` : css`
    background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;
  `}
`;

/* Add event form */
const AddEventBar = styled.div`
  padding: 1.25rem 1.5rem; background: #f9fafb; border-top: 1px solid #f3f4f6;
`;
const AddEventTitle = styled.div`
  font-size: 0.78rem; font-weight: 700; color: #6b7280; margin-bottom: 0.75rem;
  display: flex; align-items: center; gap: 0.3rem;
`;
const AddEventRow = styled.div`
  display: flex; gap: 0.6rem; flex-wrap: wrap;
`;
const EventInput = styled.input`
  flex: 1; min-width: 120px; padding: 0.5rem 0.85rem; border-radius: 10px;
  border: 1px solid #e5e7eb; font-size: 0.85rem; font-weight: 500;
  color: #1a1a2e; outline: none; background: white;
  &:focus { border-color: #22d3ee; }
  &::placeholder { color: #c0c0c0; }
`;
const EventSelect = styled.select`
  padding: 0.5rem 0.85rem; border-radius: 10px; border: 1px solid #e5e7eb;
  font-size: 0.85rem; font-weight: 600; color: #1a1a2e; background: white;
  cursor: pointer; outline: none;
  &:focus { border-color: #22d3ee; }
`;
const EventBtn = styled.button`
  padding: 0.5rem 1.1rem; border-radius: 10px; border: none;
  font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex;
  align-items: center; gap: 0.35rem;
  background: linear-gradient(135deg, #22d3ee, #06b6d4);
  color: white; box-shadow: 0 2px 8px rgba(34,211,238,0.3);
  transition: all 0.2s ease;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(34,211,238,0.4); }
  &:disabled { opacity: 0.5; cursor: wait; }
`;

/* Verify product section */
const VerifySection = styled.div`margin-bottom: 2.5rem;`;
const VerifyGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;
`;
const VerifyCard = styled(motion.div)`
  background: white; border-radius: 16px; padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.04);
  display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.07); }
`;
const ProdThumb = styled.div`
  width: 48px; height: 48px; border-radius: 12px; overflow: hidden;
  background: linear-gradient(135deg, #f0fdfa, #ccfbf1); display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const ProdMeta = styled.div`
  flex: 1; min-width: 0;
  .name { font-weight: 700; color: #1a1a2e; font-size: 0.88rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .id { font-size: 0.68rem; font-family: monospace; color: #9ca3af; }
`;
const VerifyBtn = styled.button`
  padding: 0.4rem 0.85rem; border-radius: 10px; border: none;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex;
  align-items: center; gap: 0.3rem; transition: all 0.2s ease;
  ${p => p.$verified ? css`
    background: #ecfdf5; color: #065f46; cursor: default;
  ` : p.$loading ? css`
    background: #f5f5f5; color: #9ca3af; cursor: wait;
  ` : css`
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    color: white; box-shadow: 0 2px 8px rgba(167,139,250,0.3);
    &:hover { transform: translateY(-1px); }
  `}
`;

/* Empty & Skeleton */
const EmptyBox = styled.div`
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 2px dashed #e5e7eb;
  svg { font-size: 2.5rem; color: #22d3ee; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 0.5rem; }
  p { color: #9ca3af; margin: 0; }
`;
const Skel = styled.div`
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%; animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${p => p.$r || '8px'}; height: ${p => p.$h || '14px'}; width: ${p => p.$w || '100%'};
`;

const SUPPLY_STAGES = [
    'order_placed', 'payment_confirmed', 'production_started',
    'quality_check', 'packaging', 'shipped', 'in_transit', 'delivered'
];
const stageIcon = (s) => {
    switch (s) {
        case 'delivered': return <FiCheckCircle size={14} />;
        case 'shipped': case 'in_transit': return <FiTruck size={14} />;
        case 'packaging': return <FiBox size={14} />;
        case 'quality_check': return <FiEye size={14} />;
        case 'production_started': return <FiRefreshCw size={14} />;
        case 'payment_confirmed': return <FiShield size={14} />;
        default: return <FiPackage size={14} />;
    }
};

/* ═══════ Component ═══════ */
const BlockchainSupplyChain = () => {
    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const [adding, setAdding] = useState({});
    const [verifying, setVerifying] = useState({});
    const [verified, setVerified] = useState({});
    const [eventForm, setEventForm] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch artisan orders
                let ordersData = [];
                try {
                    const ordRes = await api.get('/orders/artisan/orders', { params: { limit: 50 } });
                    ordersData = ordRes.data.orders || [];
                } catch {
                    const ordRes = await api.get('/orders/my-orders', { params: { limit: 50 } });
                    ordersData = ordRes.data.orders || [];
                }
                setOrders(ordersData);

                // Fetch artisan products
                const prodRes = await api.get('/products', { params: { artisan: userId, limit: 100 } });
                setProducts(prodRes.data.products || []);

                // Pre-populate verified products
                const v = {};
                (prodRes.data.products || []).forEach(p => {
                    if (p.blockchainId) v[p._id] = true;
                });
                setVerified(v);

                // Get blockchain stats
                try {
                    const statRes = await api.get('/blockchain/stats');
                    setStats(statRes.data);
                } catch { /* stats may fail if no blockchain data */ }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchAll();
    }, [userId]);

    const getImageUrl = (product) => {
        if (!product) return null;
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            if (typeof img === 'object' && img.url) return img.url;
            if (typeof img === 'string') return img;
        }
        return null;
    };

    const addEvent = async (orderId) => {
        const form = eventForm[orderId];
        if (!form?.stage || !form?.location) return;
        setAdding(p => ({ ...p, [orderId]: true }));
        try {
            const res = await api.post('/blockchain/add-event', {
                orderId,
                stage: form.stage,
                location: form.location,
                description: form.description || `${form.stage.replace(/_/g, ' ')} at ${form.location}`
            });
            // Refresh order supply chain
            const evtRes = await api.get(`/blockchain/events/${orderId}`);
            setOrders(prev => prev.map(o =>
                o._id === orderId ? {
                    ...o,
                    supplyChain: evtRes.data.events,
                    blockchain: {
                        transactionHash: evtRes.data.transactionHash || res.data.transactionHash,
                        isVerified: evtRes.data.blockchainVerified
                    }
                } : o
            ));
            setEventForm(p => ({ ...p, [orderId]: {} }));
            toast.success('Event added to blockchain!');
        } catch (err) {
            toast.error('Failed to add event');
        } finally {
            setAdding(p => ({ ...p, [orderId]: false }));
        }
    };

    const verifyProduct = async (productId) => {
        setVerifying(p => ({ ...p, [productId]: true }));
        try {
            const res = await api.post('/blockchain/verify-product', { productId });
            if (res.data.isVerified) {
                setVerified(p => ({ ...p, [productId]: true }));
                toast.success('Product verified on blockchain!');
            } else {
                toast.error('Verification failed — try again');
            }
        } catch (err) {
            toast.error('Verification failed');
        } finally {
            setVerifying(p => ({ ...p, [productId]: false }));
        }
    };

    const filtered = orders.filter(o => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (o.orderNumber || '').toLowerCase().includes(q) ||
            o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
    });

    const verifiedCount = Object.values(verified).filter(Boolean).length;

    return (
        <Page>
            <Hero>
                <HeroBg>
                    <HexBlock $t="15%" $l="5%" $d={5} $del={0}>0x8f2a...c3d1 &#x25CF; VERIFIED</HexBlock>
                    <HexBlock $t="35%" $l="70%" $d={6} $del={1}>BLOCK #1048293 &#x25CF; HASH</HexBlock>
                    <HexBlock $t="60%" $l="15%" $d={4} $del={2}>0xab09...ff12 &#x25CF; SUPPLY_CHAIN</HexBlock>
                    <HexBlock $t="75%" $l="55%" $d={7} $del={0.5}>&#x26D3; IMMUTABLE LEDGER</HexBlock>
                </HeroBg>
                <HeroInner>
                    <h1><FiLink size={32} /> Blockchain <span>Supply Chain</span></h1>
                    <p>Immutable, transparent tracking for every artisan product</p>
                </HeroInner>
            </Hero>

            <StatsStrip>
                <StatsRow>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <StatIcn $bg="linear-gradient(135deg,#ecfdf5,#ccfbf1)" $c="#0d9488"><FiShield size={20} /></StatIcn>
                        <StatTxt><div className="v">{stats?.verifiedOrders || 0}</div><div className="l">Verified Orders</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <StatIcn $bg="linear-gradient(135deg,#ede9fe,#ddd6fe)" $c="#7c3aed"><FiLock size={20} /></StatIcn>
                        <StatTxt><div className="v">{verifiedCount}</div><div className="l">Verified Products</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <StatIcn $bg="linear-gradient(135deg,#cffafe,#a5f3fc)" $c="#0891b2"><FiLink size={20} /></StatIcn>
                        <StatTxt><div className="v">{orders.reduce((s, o) => s + (o.supplyChain?.length || 0), 0)}</div><div className="l">Chain Events</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fef3c7,#fde68a)" $c="#d97706"><FiHash size={20} /></StatIcn>
                        <StatTxt><div className="v">{Math.round(stats?.verificationRate || 0)}%</div><div className="l">Verification Rate</div></StatTxt>
                    </StatBox>
                </StatsRow>
            </StatsStrip>

            <Main>
                {/* Product Verification */}
                {products.length > 0 && (
                    <VerifySection>
                        <Section><FiShield /> Product Authenticity</Section>
                        <VerifyGrid>
                            {products.slice(0, 8).map((p, i) => (
                                <VerifyCard key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                    <ProdThumb>
                                        {getImageUrl(p) ? <img src={getImageUrl(p)} alt="" /> : <FiPackage size={18} color="#0d9488" />}
                                    </ProdThumb>
                                    <ProdMeta>
                                        <div className="name">{p.name}</div>
                                        <div className="id">{p.blockchainId || p._id?.slice(-10)}</div>
                                    </ProdMeta>
                                    <VerifyBtn
                                        $verified={verified[p._id]}
                                        $loading={verifying[p._id]}
                                        disabled={verified[p._id] || verifying[p._id]}
                                        onClick={() => verifyProduct(p._id)}
                                    >
                                        {verified[p._id] ? <><FiCheckCircle size={13} /> Verified</>
                                            : verifying[p._id] ? <><Spinner /> ...</>
                                                : <><FiShield size={12} /> Verify</>}
                                    </VerifyBtn>
                                </VerifyCard>
                            ))}
                        </VerifyGrid>
                    </VerifySection>
                )}

                {/* Order Supply Chain */}
                <Toolbar>
                    <Section style={{ margin: 0 }}><FiLink /> Order Supply Chain</Section>
                    <SearchBox>
                        <FiSearch size={18} />
                        <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
                        {search && <FiX size={16} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setSearch('')} />}
                    </SearchBox>
                </Toolbar>

                {loading ? (
                    <Cards>
                        {[1, 2, 3].map(i => (
                            <Card key={i}><CardHeader><Skel $w="220px" $h="16px" /><Skel $w="100px" $h="28px" $r="10px" /></CardHeader></Card>
                        ))}
                    </Cards>
                ) : filtered.length > 0 ? (
                    <Cards>
                        <AnimatePresence>
                            {filtered.map((order, i) => {
                                const isOpen = expanded[order._id];
                                const chain = order.supplyChain || [];
                                const bc = order.blockchain || {};
                                const form = eventForm[order._id] || {};

                                return (
                                    <Card key={order._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} layout>
                                        <CardHeader onClick={() => setExpanded(p => ({ ...p, [order._id]: !p[order._id] }))}>
                                            <OrderMeta>
                                                <div className="num">
                                                    <FiLink size={14} color="#22d3ee" />
                                                    {order.orderNumber || `Order #${order._id?.slice(-6)}`}
                                                </div>
                                                <div className="date">
                                                    <FiClock size={11} />
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    &nbsp;&middot;&nbsp;{chain.length} events
                                                </div>
                                            </OrderMeta>
                                            <BadgeRow>
                                                <VerifiedBadge $ok={bc.isVerified}>
                                                    {bc.isVerified ? <><FiCheckCircle size={12} /> On-Chain</> : <><FiAlertCircle size={12} /> Off-Chain</>}
                                                </VerifiedBadge>
                                                <StatusBadge $s={order.status}>{order.status}</StatusBadge>
                                                <ExpandIcon>{isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}</ExpandIcon>
                                            </BadgeRow>
                                        </CardHeader>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <CardBody
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {/* Blockchain info */}
                                                    {bc.transactionHash && (
                                                        <BlockchainInfo>
                                                            <HashBadge title={bc.transactionHash}>
                                                                <FiHash size={12} /> {bc.transactionHash}
                                                            </HashBadge>
                                                            {bc.blockNumber && <BlockNum><FiBox size={12} /> Block #{bc.blockNumber.toLocaleString()}</BlockNum>}
                                                            <VerifiedBadge $ok={bc.isVerified} style={{ marginLeft: 'auto' }}>
                                                                {bc.isVerified ? <><FiLock size={11} /> Immutable</> : 'Pending'}
                                                            </VerifiedBadge>
                                                        </BlockchainInfo>
                                                    )}

                                                    {/* Supply chain timeline */}
                                                    <TimelineWrap>
                                                        <TimelineLabel><FiMapPin size={13} /> Supply Chain Journey</TimelineLabel>
                                                        {chain.length > 0 ? chain.map((evt, idx) => (
                                                            <TimelineItem key={idx}>
                                                                <div style={{ position: 'relative' }}>
                                                                    <TLDot $verified={evt.verified} $active={idx === chain.length - 1}>
                                                                        {stageIcon(evt.stage)}
                                                                    </TLDot>
                                                                    {idx < chain.length - 1 && <TLLine className="tl-line" $verified={evt.verified} />}
                                                                </div>
                                                                <TLContent>
                                                                    <div className="stage">
                                                                        {evt.stage?.replace(/_/g, ' ')}
                                                                        <VerifyTag $v={evt.verified}>
                                                                            {evt.verified ? 'Verified' : 'Unverified'}
                                                                        </VerifyTag>
                                                                    </div>
                                                                    <div className="desc">{evt.description}</div>
                                                                    <div className="meta">
                                                                        {evt.timestamp && (
                                                                            <span><FiClock size={10} /> {new Date(evt.timestamp).toLocaleString('en-IN', {
                                                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                            })}</span>
                                                                        )}
                                                                        {evt.location && <span><FiMapPin size={10} /> {evt.location}</span>}
                                                                    </div>
                                                                </TLContent>
                                                            </TimelineItem>
                                                        )) : (
                                                            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.88rem' }}>
                                                                No supply chain events yet. Add the first event below.
                                                            </div>
                                                        )}
                                                    </TimelineWrap>

                                                    {/* Add event form */}
                                                    {!['delivered', 'cancelled'].includes(order.status) && (
                                                        <AddEventBar>
                                                            <AddEventTitle><FiPlus size={13} /> Add Supply Chain Event</AddEventTitle>
                                                            <AddEventRow>
                                                                <EventSelect
                                                                    value={form.stage || ''}
                                                                    onChange={e => setEventForm(p => ({ ...p, [order._id]: { ...form, stage: e.target.value } }))}
                                                                >
                                                                    <option value="">Select stage...</option>
                                                                    {SUPPLY_STAGES.map(s => (
                                                                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                                                    ))}
                                                                </EventSelect>
                                                                <EventInput
                                                                    placeholder="Location"
                                                                    value={form.location || ''}
                                                                    onChange={e => setEventForm(p => ({ ...p, [order._id]: { ...form, location: e.target.value } }))}
                                                                />
                                                                <EventInput
                                                                    placeholder="Description (optional)"
                                                                    value={form.description || ''}
                                                                    onChange={e => setEventForm(p => ({ ...p, [order._id]: { ...form, description: e.target.value } }))}
                                                                />
                                                                <EventBtn onClick={() => addEvent(order._id)} disabled={adding[order._id] || !form.stage || !form.location}>
                                                                    {adding[order._id] ? <><Spinner /> Adding...</> : <><FiSend size={13} /> Add to Chain</>}
                                                                </EventBtn>
                                                            </AddEventRow>
                                                        </AddEventBar>
                                                    )}
                                                </CardBody>
                                            )}
                                        </AnimatePresence>
                                    </Card>
                                );
                            })}
                        </AnimatePresence>
                    </Cards>
                ) : (
                    <EmptyBox>
                        <FiLink />
                        <h3>No orders found</h3>
                        <p>Supply chain data will appear when orders are placed</p>
                    </EmptyBox>
                )}
            </Main>
        </Page>
    );
};

export default BlockchainSupplyChain;
