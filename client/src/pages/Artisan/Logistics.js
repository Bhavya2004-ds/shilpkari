import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTruck, FiPackage, FiCheckCircle, FiClock, FiAlertCircle,
    FiMapPin, FiCalendar, FiSearch, FiX, FiChevronDown,
    FiChevronUp, FiSend, FiUser, FiPhone, FiFilter
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

/* ═══════ Layout ═══════ */
const Page = styled.div`min-height: 100vh; background: #faf7f2;`;

const Hero = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  padding: 3rem 0 5rem; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: -40%; right: -8%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%); }
`;
const HeroInner = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2;
  h1 { font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 0.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    span { background: linear-gradient(135deg, #0ea5e9, #38bdf8, #0ea5e9); background-size: 200% 200%;
      animation: ${gradShift} 3s ease infinite; -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text; } }
  p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin: 0; }
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
  color: ${p => p.$c}; font-size: 1.2rem; flex-shrink: 0;
`;
const StatTxt = styled.div`
  .v { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; line-height: 1.2; }
  .l { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
`;

/* ═══════ Main ═══════ */
const Main = styled.div`max-width: 1280px; margin: 0 auto; padding: 2.5rem 2rem 4rem;`;

const Toolbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`;
const SearchBox = styled.div`
  display: flex; align-items: center; gap: 0.75rem; background: white;
  border: 2px solid #eee; border-radius: 14px; padding: 0.7rem 1.15rem;
  min-width: 280px; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  &:focus-within { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.08); }
  svg { color: #b0b0b0; flex-shrink: 0; }
  input { flex: 1; border: none; outline: none; font-size: 0.95rem; color: #1f2937; background: transparent;
    font-weight: 500; &::placeholder { color: #c0c0c0; font-weight: 400; } }
  @media (max-width: 600px) { min-width: 100%; }
`;

const FilterRow = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap;
`;
const FilterBtn = styled.button`
  padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease; border: none;
  ${p => p.$active ? css`
    background: #0ea5e9; color: white; box-shadow: 0 2px 8px rgba(14,165,233,0.3);
  ` : css`
    background: white; color: #6b7280; border: 1px solid #e5e7eb;
    &:hover { border-color: #0ea5e9; color: #0ea5e9; }
  `}
`;

/* ═══════ Order Cards ═══════ */
const OrderList = styled.div`display: flex; flex-direction: column; gap: 1.25rem;`;

const OrderCard = styled(motion.div)`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  &:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
`;

const OrderHeader = styled.div`
  padding: 1.25rem 1.5rem; display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  cursor: pointer; &:hover { background: #fafafa; }
`;

const OrderId = styled.div`
  .num { font-weight: 800; color: #1a1a2e; font-size: 1rem; }
  .date { font-size: 0.78rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; margin-top: 0.15rem; }
`;

const StatusBadge = styled.div`
  padding: 0.35rem 0.85rem; border-radius: 10px; font-size: 0.75rem;
  font-weight: 700; text-transform: capitalize; display: flex; align-items: center; gap: 0.3rem;
  ${p => {
        switch (p.$s) {
            case 'delivered': return css`background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;`;
            case 'shipped': return css`background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;`;
            case 'processing': return css`background: #fef3c7; color: #92400e; border: 1px solid #fde68a;`;
            case 'confirmed': return css`background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;`;
            case 'cancelled': return css`background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;`;
            default: return css`background: #f5f5f5; color: #6b7280; border: 1px solid #e5e7eb;`;
        }
    }}
`;

const statusIcon = (s) => {
    switch (s) {
        case 'delivered': return <FiCheckCircle size={13} />;
        case 'shipped': return <FiTruck size={13} />;
        case 'processing': return <FiPackage size={13} />;
        case 'cancelled': return <FiAlertCircle size={13} />;
        default: return <FiClock size={13} />;
    }
};

const OrderRight = styled.div`
  display: flex; align-items: center; gap: 1rem;
`;

const OrderTotal = styled.div`
  font-size: 1.1rem; font-weight: 800; color: #1a1a2e;
  .cur { font-size: 0.8rem; color: #6b7280; font-weight: 600; }
`;

const ExpandIcon = styled.div`
  width: 32px; height: 32px; border-radius: 8px; background: #f5f5f5;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; transition: all 0.2s ease;
`;

/* ═══════ Expanded Details ═══════ */
const OrderBody = styled(motion.div)`
  border-top: 1px solid #f3f4f6;
`;

const DetailGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  padding: 1.5rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const DetailSection = styled.div`
  h4 { font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: #9ca3af; margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem; }
`;

const InfoRow = styled.div`
  font-size: 0.85rem; color: #374151; margin-bottom: 0.4rem;
  display: flex; align-items: center; gap: 0.4rem;
  strong { font-weight: 600; color: #1a1a2e; }
  svg { color: #9ca3af; flex-shrink: 0; }
`;

const ItemRow = styled.div`
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem;
  padding: 0.5rem 0.65rem; background: #f9fafb; border-radius: 10px;
`;
const ItemThumb = styled.div`
  width: 40px; height: 40px; border-radius: 8px; overflow: hidden;
  background: #f0e6d3; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const ItemInfo = styled.div`
  flex: 1; min-width: 0;
  .name { font-weight: 600; color: #1a1a2e; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .qty { font-size: 0.75rem; color: #9ca3af; }
`;
const ItemPrice = styled.div`font-weight: 700; color: #1a1a2e; font-size: 0.9rem; white-space: nowrap;`;

/* Supply chain timeline */
const Timeline = styled.div`padding: 0 1.5rem 1.5rem;`;
const TimelineTitle = styled.h4`
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: #9ca3af; margin: 0 0 1rem;
  display: flex; align-items: center; gap: 0.4rem;
`;
const TimelineItem = styled.div`
  display: flex; gap: 1rem; margin-bottom: 0.75rem; position: relative;
  &:last-child .tl-line { display: none; }
`;
const TLDot = styled.div`
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${p => p.$active ? '#0ea5e9' : '#f3f4f6'};
  color: ${p => p.$active ? 'white' : '#9ca3af'};
  position: relative; z-index: 2;
  ${p => p.$active && css`animation: ${pulse} 2s ease-in-out infinite;`}
`;
const TLLine = styled.div`
  position: absolute; left: 13px; top: 28px; bottom: -8px; width: 2px;
  background: #e5e7eb;
`;
const TLContent = styled.div`
  flex: 1; padding-bottom: 0.5rem;
  .stage { font-weight: 700; color: #1a1a2e; font-size: 0.85rem; text-transform: capitalize; }
  .desc { font-size: 0.78rem; color: #6b7280; }
  .time { font-size: 0.7rem; color: #9ca3af; margin-top: 0.15rem; }
`;

/* Update status actions */
const ActionBar = styled.div`
  padding: 1rem 1.5rem; background: #f9fafb; border-top: 1px solid #f3f4f6;
  display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
`;
const ActionLabel = styled.span`font-size: 0.8rem; font-weight: 600; color: #6b7280;`;
const ActionSelect = styled.select`
  padding: 0.5rem 0.85rem; border-radius: 10px; border: 1px solid #e5e7eb;
  font-size: 0.85rem; font-weight: 600; color: #1a1a2e; background: white;
  cursor: pointer; outline: none;
  &:focus { border-color: #0ea5e9; }
`;
const ActionBtn = styled.button`
  padding: 0.5rem 1rem; border-radius: 10px; border: none;
  font-size: 0.8rem; font-weight: 700; cursor: pointer;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white; box-shadow: 0 2px 8px rgba(14,165,233,0.3);
  transition: all 0.2s ease; display: flex; align-items: center; gap: 0.3rem;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(14,165,233,0.4); }
  &:disabled { opacity: 0.5; cursor: wait; }
`;

/* ═══════ Empty & Skeleton ═══════ */
const EmptyBox = styled.div`
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 2px dashed #e5e7eb;
  svg { font-size: 2.5rem; color: #0ea5e9; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 0.5rem; }
  p { color: #9ca3af; margin: 0; }
`;
const Skel = styled.div`
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%; animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${p => p.$r || '8px'}; height: ${p => p.$h || '14px'}; width: ${p => p.$w || '100%'};
`;

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/* ═══════ Component ═══════ */
const Logistics = () => {
    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState({});
    const [updating, setUpdating] = useState({});
    const [newStatus, setNewStatus] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/orders/artisan/orders', { params: { limit: 100 } });
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error(err);
                // Try regular orders endpoint as fallback
                try {
                    const res2 = await api.get('/orders/my-orders', { params: { limit: 100 } });
                    setOrders(res2.data.orders || []);
                } catch (e) { console.error(e); }
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetch();
    }, [userId]);

    const toggleExpand = (id) => {
        setExpanded(p => ({ ...p, [id]: !p[id] }));
    };

    const updateStatus = async (orderId) => {
        const status = newStatus[orderId];
        if (!status) return;
        setUpdating(p => ({ ...p, [orderId]: true }));
        try {
            await api.put(`/orders/${orderId}/status`, {
                status,
                location: 'Artisan Workshop',
                description: `Order status updated to ${status}`
            });
            setOrders(prev => prev.map(o =>
                o._id === orderId ? { ...o, status } : o
            ));
            toast.success(`Order updated to ${status}`);
        } catch (err) {
            toast.error('Failed to update order status');
        } finally {
            setUpdating(p => ({ ...p, [orderId]: false }));
        }
    };

    const getImageUrl = (product) => {
        if (!product) return null;
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            if (typeof img === 'object' && img.url) return img.url;
            if (typeof img === 'string') return img;
        }
        return null;
    };

    const filtered = orders.filter(o => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (search) {
            const q = search.toLowerCase();
            return (o.orderNumber || '').toLowerCase().includes(q) ||
                o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
        }
        return true;
    });

    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    const shippedCount = orders.filter(o => o.status === 'shipped').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <h1><FiTruck size={32} /> Logistics & <span>Shipping</span></h1>
                    <p>Track shipments, update order statuses, and manage deliveries</p>
                </HeroInner>
            </Hero>

            <StatsStrip>
                <StatsRow>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <StatIcn $bg="linear-gradient(135deg,#fef3c7,#fde68a)" $c="#d97706"><FiClock size={20} /></StatIcn>
                        <StatTxt><div className="v">{pendingCount}</div><div className="l">Pending</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <StatIcn $bg="linear-gradient(135deg,#e0e7ff,#c7d2fe)" $c="#6366f1"><FiPackage size={20} /></StatIcn>
                        <StatTxt><div className="v">{processingCount}</div><div className="l">Processing</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <StatIcn $bg="linear-gradient(135deg,#dbeafe,#bfdbfe)" $c="#0ea5e9"><FiTruck size={20} /></StatIcn>
                        <StatTxt><div className="v">{shippedCount}</div><div className="l">Shipped</div></StatTxt>
                    </StatBox>
                    <StatBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <StatIcn $bg="linear-gradient(135deg,#d1fae5,#a7f3d0)" $c="#059669"><FiCheckCircle size={20} /></StatIcn>
                        <StatTxt><div className="v">{deliveredCount}</div><div className="l">Delivered</div></StatTxt>
                    </StatBox>
                </StatsRow>
            </StatsStrip>

            <Main>
                <Toolbar>
                    <SearchBox>
                        <FiSearch size={18} />
                        <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
                        {search && <FiX size={16} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setSearch('')} />}
                    </SearchBox>
                    <FilterRow>
                        {FILTERS.map(f => (
                            <FilterBtn key={f} $active={filter === f} onClick={() => setFilter(f)}>
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </FilterBtn>
                        ))}
                    </FilterRow>
                </Toolbar>

                {loading ? (
                    <OrderList>
                        {[1, 2, 3].map(i => (
                            <OrderCard key={i}>
                                <OrderHeader><Skel $w="200px" $h="16px" /><Skel $w="80px" $h="28px" $r="10px" /></OrderHeader>
                            </OrderCard>
                        ))}
                    </OrderList>
                ) : filtered.length > 0 ? (
                    <OrderList>
                        <AnimatePresence>
                            {filtered.map((order, i) => {
                                const isOpen = expanded[order._id];
                                const total = order.payment?.amount?.total || 0;

                                return (
                                    <OrderCard key={order._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} layout>
                                        <OrderHeader onClick={() => toggleExpand(order._id)}>
                                            <OrderId>
                                                <div className="num">{order.orderNumber || `Order #${order._id?.slice(-6)}`}</div>
                                                <div className="date">
                                                    <FiCalendar size={12} />
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </OrderId>
                                            <OrderRight>
                                                <StatusBadge $s={order.status}>
                                                    {statusIcon(order.status)} {order.status}
                                                </StatusBadge>
                                                <OrderTotal><span className="cur">{'\u20B9'}</span>{total.toLocaleString('en-IN')}</OrderTotal>
                                                <ExpandIcon>{isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}</ExpandIcon>
                                            </OrderRight>
                                        </OrderHeader>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <OrderBody
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <DetailGrid>
                                                        {/* Items */}
                                                        <DetailSection>
                                                            <h4><FiPackage size={13} /> Items</h4>
                                                            {order.items?.map((item, idx) => (
                                                                <ItemRow key={idx}>
                                                                    <ItemThumb>
                                                                        {getImageUrl(item.product) ? (
                                                                            <img src={getImageUrl(item.product)} alt="" />
                                                                        ) : (
                                                                            <FiPackage size={16} color="#d4a574" />
                                                                        )}
                                                                    </ItemThumb>
                                                                    <ItemInfo>
                                                                        <div className="name">{item.product?.name || 'Product'}</div>
                                                                        <div className="qty">Qty: {item.quantity}</div>
                                                                    </ItemInfo>
                                                                    <ItemPrice>{'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}</ItemPrice>
                                                                </ItemRow>
                                                            ))}
                                                        </DetailSection>

                                                        {/* Shipping Address */}
                                                        <DetailSection>
                                                            <h4><FiMapPin size={13} /> Shipping Details</h4>
                                                            {order.shippingAddress ? (
                                                                <>
                                                                    <InfoRow><FiUser size={13} /> <strong>{order.shippingAddress.name}</strong></InfoRow>
                                                                    <InfoRow><FiMapPin size={13} /> {order.shippingAddress.street}, {order.shippingAddress.city}</InfoRow>
                                                                    <InfoRow>{order.shippingAddress.state} - {order.shippingAddress.pincode}</InfoRow>
                                                                    {order.shippingAddress.phone && <InfoRow><FiPhone size={13} /> {order.shippingAddress.phone}</InfoRow>}
                                                                </>
                                                            ) : (
                                                                <InfoRow style={{ color: '#9ca3af' }}>No shipping address provided</InfoRow>
                                                            )}

                                                            {order.tracking?.carrier && (
                                                                <>
                                                                    <h4 style={{ marginTop: '1rem' }}><FiTruck size={13} /> Tracking</h4>
                                                                    <InfoRow><strong>Carrier:</strong> {order.tracking.carrier}</InfoRow>
                                                                    <InfoRow><strong>Tracking:</strong> {order.tracking.trackingNumber}</InfoRow>
                                                                    {order.tracking.estimatedDelivery && (
                                                                        <InfoRow><FiCalendar size={13} /> Est. {new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN')}</InfoRow>
                                                                    )}
                                                                </>
                                                            )}
                                                        </DetailSection>
                                                    </DetailGrid>

                                                    {/* Supply Chain Timeline */}
                                                    {order.supplyChain && order.supplyChain.length > 0 && (
                                                        <Timeline>
                                                            <TimelineTitle><FiMapPin size={13} /> Supply Chain</TimelineTitle>
                                                            {order.supplyChain.map((event, idx) => (
                                                                <TimelineItem key={idx}>
                                                                    <div style={{ position: 'relative' }}>
                                                                        <TLDot $active={idx === order.supplyChain.length - 1}>
                                                                            {event.verified ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                                                        </TLDot>
                                                                        {idx < order.supplyChain.length - 1 && <TLLine className="tl-line" />}
                                                                    </div>
                                                                    <TLContent>
                                                                        <div className="stage">{event.stage?.replace(/_/g, ' ')}</div>
                                                                        <div className="desc">{event.description}</div>
                                                                        <div className="time">
                                                                            {event.timestamp && new Date(event.timestamp).toLocaleString('en-IN', {
                                                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                            })}
                                                                            {event.location && ` · ${event.location}`}
                                                                        </div>
                                                                    </TLContent>
                                                                </TimelineItem>
                                                            ))}
                                                        </Timeline>
                                                    )}

                                                    {/* Update Status */}
                                                    {!['delivered', 'cancelled'].includes(order.status) && (
                                                        <ActionBar>
                                                            <ActionLabel>Update status:</ActionLabel>
                                                            <ActionSelect
                                                                value={newStatus[order._id] || order.status}
                                                                onChange={e => setNewStatus(p => ({ ...p, [order._id]: e.target.value }))}
                                                            >
                                                                {STATUS_FLOW.map(s => (
                                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                                ))}
                                                            </ActionSelect>
                                                            <ActionBtn
                                                                onClick={() => updateStatus(order._id)}
                                                                disabled={updating[order._id] || !newStatus[order._id] || newStatus[order._id] === order.status}
                                                            >
                                                                <FiSend size={13} /> {updating[order._id] ? 'Updating...' : 'Update'}
                                                            </ActionBtn>
                                                        </ActionBar>
                                                    )}
                                                </OrderBody>
                                            )}
                                        </AnimatePresence>
                                    </OrderCard>
                                );
                            })}
                        </AnimatePresence>
                    </OrderList>
                ) : (
                    <EmptyBox>
                        <FiTruck />
                        <h3>{filter !== 'all' ? `No ${filter} orders` : 'No orders yet'}</h3>
                        <p>Orders and shipment tracking will appear here</p>
                    </EmptyBox>
                )}
            </Main>
        </Page>
    );
};

export default Logistics;
