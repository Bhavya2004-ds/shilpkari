import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch,
  FiAlertCircle, FiStar, FiGrid, FiList,
  FiX, FiCheck, FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

/* ═══════════════════════════════════════════
   Animations
   ═══════════════════════════════════════════ */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.2); }
  50% { box-shadow: 0 0 20px 5px rgba(217, 119, 6, 0.15); }
`;

/* ═══════════════════════════════════════════
   Layout
   ═══════════════════════════════════════════ */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #faf7f2;
`;

const HeroBanner = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  padding: 3rem 0 5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, transparent 70%);
    animation: ${float} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
    animation: ${float} 6s ease-in-out infinite reverse;
  }
`;

const HeroContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
    background-size: 200% 200%;
    animation: ${gradientShift} 3s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 600px) {
    font-size: 1.75rem;
  }
`;

const HeroSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  margin: 0;
  max-width: 500px;
`;

const AddProductBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255,255,255,0.15);
  letter-spacing: 0.3px;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 35px rgba(217, 119, 6, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    color: white;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

/* ═══════════════════════════════════════════
   Stats Strip
   ═══════════════════════════════════════════ */
const StatsStrip = styled.div`
  max-width: 1280px;
  margin: -2.5rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.2s ease;

  &:hover { transform: translateY(-2px); }
`;

const StatIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${p => p.$bg || 'linear-gradient(135deg, #fef3c7, #fde68a)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color || '#d97706'};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1.2;
  }
  .label {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

/* ═══════════════════════════════════════════
   Toolbar
   ═══════════════════════════════════════════ */
const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 2px solid #eee;
  border-radius: 14px;
  padding: 0.7rem 1.15rem;
  min-width: 320px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);

  &:focus-within {
    border-color: #d97706;
    box-shadow: 0 0 0 4px rgba(217,119,6,0.08);
  }

  svg { color: #b0b0b0; flex-shrink: 0; }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.95rem;
    color: #1f2937;
    background: transparent;
    font-weight: 500;

    &::placeholder { color: #c0c0c0; font-weight: 400; }
  }

  @media (max-width: 700px) { min-width: 100%; }
`;

const ViewToggle = styled.div`
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.$active ? '#d97706' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#9ca3af'};

  &:hover {
    background: ${p => p.$active ? '#d97706' : '#f5f5f5'};
    color: ${p => p.$active ? 'white' : '#6b7280'};
  }
`;

const ResultCount = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;

  strong {
    color: #1a1a2e;
    font-weight: 700;
  }
`;

/* ═══════════════════════════════════════════
   Product Cards — Grid View
   ═══════════════════════════════════════════ */
const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    border-color: rgba(217,119,6,0.15);

    .card-image img {
      transform: scale(1.08);
    }

    .card-overlay {
      opacity: 1;
    }
  }
`;

const CardImageWrap = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f8f4ec 0%, #f0e6d3 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.35s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.25rem;
  gap: 0.6rem;
`;

const OverlayBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &:hover {
    background: #d97706;
    color: white;
    transform: scale(1.1);
  }
`;

const OverlayBtnDel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #dc2626;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.1);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  padding: 0.3rem 0.85rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  z-index: 2;
  backdrop-filter: blur(8px);

  ${p => p.$active ? css`
    background: rgba(16, 185, 129, 0.15);
    color: #065f46;
    border: 1px solid rgba(16, 185, 129, 0.2);
  ` : css`
    background: rgba(239, 68, 68, 0.15);
    color: #991b1b;
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}
`;

const FeaturedTag = styled.span`
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(217, 119, 6, 0.15);
  color: #92400e;
  border: 1px solid rgba(217, 119, 6, 0.2);
  backdrop-filter: blur(8px);
  z-index: 2;
`;

const CardBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const CardCategory = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #d97706;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.75rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceTag = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a1a2e;

  .currency {
    font-size: 0.9rem;
    font-weight: 600;
    color: #6b7280;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const SmallActionBtn = styled(Link)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
  background: ${p => p.$bg || '#f5f5f5'};
  color: ${p => p.$color || '#6b7280'};

  &:hover {
    background: ${p => p.$hoverBg || '#d97706'};
    color: white;
    transform: scale(1.1);
  }
`;

const SmallDelBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff5f5;
  color: #e53e3e;

  &:hover {
    background: #e53e3e;
    color: white;
    transform: scale(1.1);
  }
`;

/* ═══════════════════════════════════════════
   Product Cards — List View
   ═══════════════════════════════════════════ */
const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem 1rem 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    border-color: rgba(217,119,6,0.15);
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
`;

const ListImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f8f4ec, #f0e6d3);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 700px) {
    width: 100%;
    height: 160px;
  }
`;

const ListInfo = styled.div`
  flex: 1;
  min-width: 0;

  .cat {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #d97706;
    margin-bottom: 0.25rem;
  }

  .name {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
`;

const ListBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  ${p => p.$active ? css`
    background: #ecfdf5;
    color: #065f46;
  ` : css`
    background: #fef2f2;
    color: #991b1b;
  `}
`;

const ListPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-right: 1.5rem;
  white-space: nowrap;

  .currency { font-size: 0.85rem; color: #6b7280; font-weight: 600; }
`;

const ListActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════
   Empty State
   ═══════════════════════════════════════════ */
const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  border: 2px dashed #e5e7eb;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #d97706;
  font-size: 2rem;
  animation: ${pulseGlow} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 0.5rem;
`;

const EmptyDesc = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  margin: 0 0 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

/* ═══════════════════════════════════════════
   Loading Skeleton
   ═══════════════════════════════════════════ */
const SkeletonCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);

  .skel-img {
    height: 220px;
    background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s ease-in-out infinite;
  }

  .skel-body {
    padding: 1.25rem 1.5rem 1.5rem;
  }

  .skel-line {
    height: 12px;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════
   Delete Modal
   ═══════════════════════════════════════════ */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
`;

const ModalIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: #dc2626;
  font-size: 1.75rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 0.5rem;
`;

const ModalDesc = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const ModalBtn = styled.button`
  flex: 1;
  padding: 0.85rem;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &.cancel {
    background: #f5f5f5;
    color: #374151;
    &:hover { background: #e5e5e5; }
  }

  &.delete {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    box-shadow: 0 4px 15px rgba(220,38,38,0.3);
    &:hover { box-shadow: 0 8px 25px rgba(220,38,38,0.4); transform: translateY(-1px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  }
`;

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
const MyProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // user._id from /me endpoint, user.id from login/register response
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products', {
          params: { artisan: userId, limit: 100 }
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Failed to load your products');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProducts();
  }, [userId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (typeof img === 'object' && img.url) return img.url;
      if (typeof img === 'string') return img;
    }
    return null;
  };

  const activeCount = products.filter(p => p.isActive !== false).length;
  const featuredCount = products.filter(p => p.isFeatured).length;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <PageWrapper>
      {/* ── Hero Banner ── */}
      <HeroBanner>
        <HeroContent>
          <HeroTop>
            <div>
              <HeroTitle>
                <FiShoppingBag size={32} />
                My <span>Products</span>
              </HeroTitle>
              <HeroSubtitle>
                Manage your artisan catalog, track listings, and grow your shop
              </HeroSubtitle>
            </div>
            <AddProductBtn to="/artisan/add-product">
              <FiPlus size={18} /> Add New Product
            </AddProductBtn>
          </HeroTop>
        </HeroContent>
      </HeroBanner>

      {/* ── Stats ── */}
      <StatsStrip>
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIconBox $bg="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#d97706">
              <FiPackage size={20} />
            </StatIconBox>
            <StatInfo>
              <div className="value">{products.length}</div>
              <div className="label">Total Products</div>
            </StatInfo>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIconBox $bg="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#059669">
              <FiCheck size={20} />
            </StatIconBox>
            <StatInfo>
              <div className="value">{activeCount}</div>
              <div className="label">Active Listings</div>
            </StatInfo>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIconBox $bg="linear-gradient(135deg, #fce7f3, #fbcfe8)" $color="#db2777">
              <FiStar size={20} />
            </StatIconBox>
            <StatInfo>
              <div className="value">{featuredCount}</div>
              <div className="label">Featured</div>
            </StatInfo>
          </StatCard>
        </StatsGrid>
      </StatsStrip>

      {/* ── Main Content ── */}
      <MainContent>
        <Toolbar>
          <SearchBox>
            <FiSearch size={18} />
            <input
              placeholder="Search your products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <FiX
                size={16}
                style={{ cursor: 'pointer', color: '#9ca3af' }}
                onClick={() => setSearch('')}
              />
            )}
          </SearchBox>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ResultCount>
              Showing <strong>{filtered.length}</strong> of {products.length}
            </ResultCount>
            <ViewToggle>
              <ToggleBtn $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                <FiGrid size={16} />
              </ToggleBtn>
              <ToggleBtn $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
                <FiList size={16} />
              </ToggleBtn>
            </ViewToggle>
          </div>
        </Toolbar>

        {loading ? (
          <ProductsGrid>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonCard key={i}>
                <div className="skel-img" />
                <div className="skel-body">
                  <div className="skel-line" style={{ width: '40%', height: 10 }} />
                  <div className="skel-line" style={{ width: '80%', height: 14 }} />
                  <div className="skel-line" style={{ width: '50%', height: 18, marginTop: '0.5rem' }} />
                </div>
              </SkeletonCard>
            ))}
          </ProductsGrid>
        ) : filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <ProductsGrid>
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <CardImageWrap className="card-image">
                      {getImageUrl(product) ? (
                        <img src={getImageUrl(product)} alt={product.name} />
                      ) : (
                        <FiPackage size={48} color="#d4a574" />
                      )}
                      <Badge $active={product.isActive !== false}>
                        {product.isActive !== false ? '● Live' : '● Draft'}
                      </Badge>
                      {product.isFeatured && (
                        <FeaturedTag><FiStar size={10} /> Featured</FeaturedTag>
                      )}
                      <ImageOverlay className="card-overlay">
                        <OverlayBtn to={`/products/${product._id}`} title="View">
                          <FiEye size={16} />
                        </OverlayBtn>
                        <OverlayBtn to={`/artisan/edit-product/${product._id}`} title="Edit">
                          <FiEdit2 size={16} />
                        </OverlayBtn>
                        <OverlayBtnDel onClick={() => setDeleteTarget(product)} title="Delete">
                          <FiTrash2 size={16} />
                        </OverlayBtnDel>
                      </ImageOverlay>
                    </CardImageWrap>
                    <CardBody>
                      <CardCategory>{product.category}</CardCategory>
                      <CardTitle>{product.name}</CardTitle>
                      <CardBottom>
                        <PriceTag>
                          <span className="currency">₹</span>
                          {product.price?.toLocaleString('en-IN')}
                        </PriceTag>
                        <QuickActions>
                          <SmallActionBtn
                            to={`/products/${product._id}`}
                            $bg="#f0f9ff" $color="#0369a1" $hoverBg="#0369a1"
                            title="View"
                          >
                            <FiEye size={14} />
                          </SmallActionBtn>
                          <SmallActionBtn
                            to={`/artisan/edit-product/${product._id}`}
                            $bg="#fefce8" $color="#a16207" $hoverBg="#d97706"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </SmallActionBtn>
                          <SmallDelBtn onClick={() => setDeleteTarget(product)} title="Delete">
                            <FiTrash2 size={14} />
                          </SmallDelBtn>
                        </QuickActions>
                      </CardBottom>
                    </CardBody>
                  </ProductCard>
                ))}
              </AnimatePresence>
            </ProductsGrid>
          ) : (
            <ProductsList>
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <ListCard
                    key={product._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <ListImage>
                      {getImageUrl(product) ? (
                        <img src={getImageUrl(product)} alt={product.name} />
                      ) : (
                        <FiPackage size={28} color="#d4a574" />
                      )}
                    </ListImage>
                    <ListInfo>
                      <div className="cat">{product.category}</div>
                      <div className="name">{product.name}</div>
                      <div className="meta">
                        <ListBadge $active={product.isActive !== false}>
                          {product.isActive !== false ? '● Live' : '● Draft'}
                        </ListBadge>
                        {product.isFeatured && (
                          <ListBadge $active style={{ background: '#fef3c7', color: '#92400e' }}>
                            ★ Featured
                          </ListBadge>
                        )}
                      </div>
                    </ListInfo>
                    <ListPrice>
                      <span className="currency">₹</span>
                      {product.price?.toLocaleString('en-IN')}
                    </ListPrice>
                    <ListActions>
                      <SmallActionBtn
                        to={`/products/${product._id}`}
                        $bg="#f0f9ff" $color="#0369a1" $hoverBg="#0369a1"
                      >
                        <FiEye size={14} />
                      </SmallActionBtn>
                      <SmallActionBtn
                        to={`/artisan/edit-product/${product._id}`}
                        $bg="#fefce8" $color="#a16207" $hoverBg="#d97706"
                      >
                        <FiEdit2 size={14} />
                      </SmallActionBtn>
                      <SmallDelBtn onClick={() => setDeleteTarget(product)}>
                        <FiTrash2 size={14} />
                      </SmallDelBtn>
                    </ListActions>
                  </ListCard>
                ))}
              </AnimatePresence>
            </ProductsList>
          )
        ) : (
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyIcon>
              <FiPackage />
            </EmptyIcon>
            <EmptyTitle>
              {search ? 'No matching products' : 'Your shop is empty'}
            </EmptyTitle>
            <EmptyDesc>
              {search
                ? 'Try a different search term to find what you\'re looking for.'
                : 'Start building your artisan catalog by adding your first handcrafted product.'}
            </EmptyDesc>
            {!search && (
              <AddProductBtn to="/artisan/add-product">
                <FiPlus size={18} /> Add Your First Product
              </AddProductBtn>
            )}
          </EmptyState>
        )}
      </MainContent>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <ModalBox
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalIcon><FiAlertCircle /></ModalIcon>
              <ModalTitle>Delete this product?</ModalTitle>
              <ModalDesc>
                <strong>"{deleteTarget.name}"</strong> will be permanently removed.
                This action cannot be undone.
              </ModalDesc>
              <ModalActions>
                <ModalBtn className="cancel" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Keep it
                </ModalBtn>
                <ModalBtn className="delete" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </ModalBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default MyProducts;
