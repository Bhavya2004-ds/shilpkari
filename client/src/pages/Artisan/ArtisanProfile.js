import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';

const API_BASE = process.env.REACT_APP_API_URL || '';

function resolveImage(img) {
  if (!img) return null;
  let url = img;
  if (typeof img === 'object') {
    if (img.url) url = img.url;
    else if (img.path) url = img.path;
    else if (img.secure_url) url = img.secure_url;
    else if (img.publicUrl) url = img.publicUrl;
    else if (typeof img.toString === 'function') url = img.toString();
  }
  if (typeof url !== 'string') return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/artisans/${id}`);
        setArtisan(data.artisan || null);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load artisan', err);
        setArtisan(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!artisan) return <div style={{ padding: 24 }}>Artisan not found.</div>;

  const bio = artisan.artisanProfile?.bio || 'This artisan creates unique handcrafted pieces using traditional techniques. Explore their shop below to see available items.';
  const business = artisan.artisanProfile?.businessName || '';
  const specialties = artisan.artisanProfile?.specialties || artisan.specialties || [];
  const gallery = artisan.artisanProfile?.gallery || artisan.gallery || [];
  const productCount = products.length;

  return (
    <div style={{ maxWidth: 1200, margin: '2.5rem auto', padding: '0 1rem', fontFamily: 'Inter, system-ui, Arial' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 42, flexShrink: 0 }}>
          {artisan.profileImage ? (
            <img
              src={resolveImage(artisan.profileImage)}
              alt={artisan.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/110?text=A'; }}
            />
          ) : (artisan.name?.charAt(0)?.toUpperCase() || 'A')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>{artisan.name}</h1>
          {business ? <div style={{ color: '#6b7280', marginTop: 6 }}>{business}</div> : null}
          <p style={{ marginTop: 12, color: '#374151', lineHeight: 1.5 }}>{bio}</p>

          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', padding: '6px 10px', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <strong>{productCount}</strong> {productCount === 1 ? 'product' : 'products'}
            </div>
            {specialties.length > 0 && (
              <div style={{ color: '#6b7280' }}>{specialties.slice(0,3).join(' • ')}</div>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <a href={`mailto:${artisan.contact?.email || ''}`} style={{ background: '#d97706', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Message</a>
              <button style={{ background: '#fff', color: '#d97706', border: '1px solid #d97706', padding: '8px 12px', borderRadius: 8 }}>Follow</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: left content + right sidebar */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left column */}
        <div style={{ flex: '1 1 640px', minWidth: 300 }}>
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>About the artisan</h3>
            <p style={{ color: '#4b5563', marginTop: 8 }}>{bio}</p>

            {specialties.length > 0 && (
              <>
                <h4 style={{ marginBottom: 8 }}>Specialties</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {specialties.map((s,i) => <span key={i} style={{ background:'#fff', border:'1px solid #e6e6e6', padding:'6px 10px', borderRadius: 18, color:'#374151' }}>{s}</span>)}
                </div>
              </>
            )}

            <div style={{ marginTop: 18 }}>
              <h4 style={{ marginBottom: 8 }}>Products by {artisan.name}</h4>
              {products.length === 0 ? <div style={{ color:'#6b7280' }}>No products yet.</div> : (
                <div style={{ display:'grid', gap:12 }}>
                  {products.map(p => {
                    const img = resolveImage(p.images?.[0]);
                    return (
                      <Link key={p._id || p.id} to={`/products/${p._id || p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                        <div style={{ display:'flex', gap:12, alignItems:'center', background:'#fff', padding:10, borderRadius:8, border:'1px solid #f1f1f1' }}>
                          <div style={{ width:120, height:70, borderRadius:6, overflow:'hidden', background:'#f3f4f6', flexShrink:0 }}>
                            {img ? <img src={img} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src='https://via.placeholder.com/120x70?text=No+Image'; }} /> : <div style={{ padding:10, color:'#9ca3af' }}>No image</div>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600 }}>{p.title}</div>
                            <div style={{ color:'#6b7280', marginTop:6 }}>{p.price ? `₹${p.price}` : ''}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ width: 300, flexShrink: 0 }}>
          <div style={{ background:'#fff', padding:16, borderRadius:10, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', marginBottom:16 }}>
            <h4 style={{ marginTop:0 }}>Contact</h4>
            <div style={{ color:'#4b5563', marginTop:6 }}>
              {artisan.contact?.email ? <div><strong>Email:</strong> <a href={`mailto:${artisan.contact.email}`}>{artisan.contact.email}</a></div> : <div style={{ color:'#9ca3af' }}>Email not provided</div>}
              {artisan.contact?.phone ? <div style={{ marginTop:6 }}><strong>Phone:</strong> {artisan.contact.phone}</div> : null}
              {artisan.artisanProfile?.website ? <div style={{ marginTop:6 }}><strong>Website:</strong> <a href={artisan.artisanProfile.website} target="_blank" rel="noreferrer">{artisan.artisanProfile.website}</a></div> : null}
            </div>
          </div>

          <div style={{ background:'#fff', padding:12, borderRadius:10, boxShadow:'0 6px 18px rgba(15,23,42,0.06)' }}>
            <h4 style={{ marginTop:0 }}>Gallery</h4>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginTop:8 }}>
              {(gallery.length ? gallery : products.slice(0,4).map(p => p.images?.[0])).slice(0,4).map((g,i) => {
                const src = resolveImage(g);
                return (
                  <div key={i} style={{ width:'100%', height:72, borderRadius:8, overflow:'hidden', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {src ? <img src={src} alt={`gallery-${i}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src='https://via.placeholder.com/150?text=No+Image'; }} /> : <div style={{ color:'#9ca3af' }}>No image</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:10, textAlign:'center' }}>
              {gallery.length + products.length === 0 ? <div style={{ color:'#9ca3af' }}>No gallery images</div> : <Link to={`/artisan/${id}#gallery`} style={{ color:'#d97706', textDecoration:'none' }}>View more</Link>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
