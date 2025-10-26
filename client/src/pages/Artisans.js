import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 0;
  background: #f9fafb;
`;

const PageContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
`;

const Avatar = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  background: linear-gradient(135deg,#d97706,#b45309);
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:1.25rem;
`;

const Name = styled.h3`
  margin: 0.25rem 0;
  font-size: 1.125rem;
  color: #111827;
`;

const Specialty = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
`;

const ViewButton = styled(Link)`
  display:inline-block;
  padding:0.5rem 1rem;
  background: #d97706;
  color:#fff;
  border-radius:0.5rem;
  text-decoration:none;
`;

const ArtisansPage = () => {
  const { t } = useLanguage();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/artisans', { params: { page: 1, limit: 50 } });
        setArtisans(data.artisans || []);
      } catch (err) {
        console.error('Failed to load artisans', err);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <PageContent>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('home.artisans.title') || 'Artisans'}</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>{t('home.artisans.subtitle') || 'Discover our talented artisans'}</p>

        {loading ? <p style={{ textAlign: 'center' }}>{t('common.loading') || 'Loading…'}</p> : (
          artisans.length === 0 ? <p style={{ textAlign: 'center' }}>No artisans found.</p> : (
            <Grid>
              {artisans.map(a => (
                <Card key={a._id}>
                  <Avatar>
                    {a.profileImage ? <img src={a.profileImage} alt={a.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (a.name?.charAt(0)?.toUpperCase() || 'A')}
                  </Avatar>
                  <Name>{a.name}</Name>
                  <Specialty>{a.artisanProfile?.businessName || (a.artisanProfile?.specialties?.join(', ') || '')}</Specialty>
                  <ViewButton to={`/artisan/${a._id}`}>View Profile</ViewButton>
                </Card>
              ))}
            </Grid>
          )
        )}
      </PageContent>
    </PageContainer>
  );
};

export default ArtisansPage;