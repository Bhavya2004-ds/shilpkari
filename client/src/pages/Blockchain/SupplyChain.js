import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../lib/api';

const SupplyChainContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const SupplyChainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const SupplyChain = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/blockchain/events/${id}`);
        setEvents(data.events || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <SupplyChainContainer>
      <SupplyChainContent>
        <h1>Supply Chain Tracking</h1>
        {loading ? <p>Loading...</p> : (
          <ul style={{ textAlign: 'left' }}>
            {events.map((e, idx) => (
              <li key={idx} style={{ marginBottom: '0.75rem' }}>
                <strong>{e.stage}</strong> - {e.description} ({new Date(e.timestamp).toLocaleString()})
              </li>
            ))}
          </ul>
        )}
      </SupplyChainContent>
    </SupplyChainContainer>
  );
};

export default SupplyChain;
