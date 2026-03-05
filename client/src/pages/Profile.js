import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit3,
  FiLock,
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiCheck,
  FiX,
  FiCamera,
  FiSave,
  FiAward
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%);
  padding: 2rem 0 4rem;
`;

const ProfileContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #78350f;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    color: #d97706;
  }
`;

const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  text-align: center;
  padding: 2rem;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #b45309);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(217, 119, 6, 0.35);
  border: 4px solid #fde68a;
`;

const AvatarBadge = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #78350f, #92400e);
  border: 3px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(120, 53, 15, 0.3);

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #d97706, #b45309);
  }
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #78350f;
  margin: 0 0 0.25rem;
`;

const UserEmail = styled.p`
  color: #92400e;
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 1rem;
  background: ${props => props.$role === 'artisan' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #fef3c7, #fde68a)'};
  color: ${props => props.$role === 'artisan' ? 'white' : '#78350f'};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: ${props => props.$role === 'artisan' ? '0 4px 12px rgba(217, 119, 6, 0.3)' : '0 2px 6px rgba(120, 53, 15, 0.1)'};
`;

const MemberSince = styled.div`
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #fde68a;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #78350f;
    font-weight: 500;
  }
`;

const StatsCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  padding: 1.5rem;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const StatsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #78350f;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #d97706;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const StatItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #fde68a;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(217, 119, 6, 0.2);
    border-color: #d97706;
  }

  svg {
    font-size: 1.5rem;
    color: #d97706;
    margin-bottom: 0.5rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #78350f;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #92400e;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.08);
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.1);
`;

const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 12px;
  border: 1px solid #fde68a;
`;

const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #92400e;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #78350f;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #78350f;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-size: 1rem;
  background: #fffbeb;
  transition: all 0.2s ease;
  color: #78350f;

  &:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  &::placeholder {
    color: #b5651d;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #78350f;
  border: 2px solid #fde68a;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const SecurityNote = styled.p`
  color: #92400e;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const { items: cartItems } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const { data } = await api.get('/orders/my-orders?limit=1');
        setOrdersCount(data.total || 0);
      } catch (error) {
        console.error('Error fetching orders count:', error);
      }
    };
    fetchOrdersCount();
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ProfileContainer>
      <ProfileContent>
        <PageTitle>
          <FiUser />
          My Profile
        </PageTitle>

        <ProfileLayout>
          <Sidebar>
            <ProfileCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AvatarWrapper>
                <Avatar>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <AvatarBadge title="Change Avatar">
                  <FiCamera size={16} />
                </AvatarBadge>
              </AvatarWrapper>
              <UserName>{user?.name || 'User'}</UserName>
              <UserEmail>{user?.email || 'email@example.com'}</UserEmail>
              <RoleBadge $role={user?.role}>
                <FiAward size={14} />
                {user?.role || 'Buyer'}
              </RoleBadge>
              <MemberSince>
                <span>
                  <FiCalendar size={14} />
                  Member since {formatDate(user?.createdAt)}
                </span>
              </MemberSince>
            </ProfileCard>

            <StatsCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <StatsTitle>
                <FiPackage />
                Quick Stats
              </StatsTitle>
              <StatsGrid>
                <StatItem to="/orders">
                  <FiShoppingBag />
                  <StatValue>{user?.ordersCount || 0}</StatValue>
                  <StatLabel>Orders</StatLabel>
                </StatItem>
                <StatItem to="/wishlist">
                  <FiHeart />
                  <StatValue>{wishlistCount}</StatValue>
                  <StatLabel>Wishlist</StatLabel>
                </StatItem>
                <StatItem to="/cart">
                  <FiPackage />
                  <StatValue>{cartCount}</StatValue>
                  <StatLabel>In Cart</StatLabel>
                </StatItem>
                <StatItem to="/orders">
                  <FiCheck />
                  <StatValue>{user?.completedOrders || 0}</StatValue>
                  <StatLabel>Completed</StatLabel>
                </StatItem>
              </StatsGrid>
            </StatsCard>
          </Sidebar>

          <MainContent>
            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SectionHeader>
                <h3>
                  <FiUser size={18} />
                  Personal Information
                </h3>
                {!isEditing && (
                  <EditButton onClick={() => setIsEditing(true)}>
                    <FiEdit3 size={16} />
                    Edit
                  </EditButton>
                )}
              </SectionHeader>
              <SectionContent>
                {isEditing ? (
                  <Form onSubmit={handleSaveProfile}>
                    <FormRow>
                      <FormGroup>
                        <Label>Full Name</Label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </FormGroup>
                    </FormRow>
                    <FormRow>
                      <FormGroup>
                        <Label>Phone Number</Label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>PIN Code</Label>
                        <Input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="Enter PIN code"
                        />
                      </FormGroup>
                    </FormRow>
                    <FormGroup>
                      <Label>Address</Label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                      />
                    </FormGroup>
                    <FormRow>
                      <FormGroup>
                        <Label>City</Label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>State</Label>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter your state"
                        />
                      </FormGroup>
                    </FormRow>
                    <ButtonGroup>
                      <SaveButton type="submit" disabled={saving}>
                        <FiSave size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </SaveButton>
                      <CancelButton type="button" onClick={cancelEdit}>
                        <FiX size={16} />
                        Cancel
                      </CancelButton>
                    </ButtonGroup>
                  </Form>
                ) : (
                  <InfoGrid>
                    <InfoItem>
                      <InfoIcon>
                        <FiUser size={18} />
                      </InfoIcon>
                      <InfoText>
                        <InfoLabel>Full Name</InfoLabel>
                        <InfoValue>{user?.name || 'Not set'}</InfoValue>
                      </InfoText>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>
                        <FiMail size={18} />
                      </InfoIcon>
                      <InfoText>
                        <InfoLabel>Email</InfoLabel>
                        <InfoValue>{user?.email || 'Not set'}</InfoValue>
                      </InfoText>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>
                        <FiPhone size={18} />
                      </InfoIcon>
                      <InfoText>
                        <InfoLabel>Phone</InfoLabel>
                        <InfoValue>{user?.phone || 'Not set'}</InfoValue>
                      </InfoText>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>
                        <FiMapPin size={18} />
                      </InfoIcon>
                      <InfoText>
                        <InfoLabel>Address</InfoLabel>
                        <InfoValue>
                          {user?.address ?
                            `${user.address}${user.city ? `, ${user.city}` : ''}${user.state ? `, ${user.state}` : ''}${user.pincode ? ` - ${user.pincode}` : ''}`
                            : 'Not set'}
                        </InfoValue>
                      </InfoText>
                    </InfoItem>
                  </InfoGrid>
                )}
              </SectionContent>
            </Section>

            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <SectionHeader>
                <h3>
                  <FiLock size={18} />
                  Security
                </h3>
              </SectionHeader>
              <SectionContent>
                {isChangingPassword ? (
                  <Form onSubmit={handleChangePassword}>
                    <FormGroup>
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </FormGroup>
                    <FormRow>
                      <FormGroup>
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                        />
                      </FormGroup>
                    </FormRow>
                    <ButtonGroup>
                      <SaveButton type="submit" disabled={saving}>
                        <FiLock size={16} />
                        {saving ? 'Updating...' : 'Update Password'}
                      </SaveButton>
                      <CancelButton type="button" onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}>
                        <FiX size={16} />
                        Cancel
                      </CancelButton>
                    </ButtonGroup>
                  </Form>
                ) : (
                  <div>
                    <SecurityNote>
                      <FiLock size={16} />
                      Keep your account secure by using a strong password.
                    </SecurityNote>
                    <SaveButton type="button" onClick={() => setIsChangingPassword(true)}>
                      <FiLock size={16} />
                      Change Password
                    </SaveButton>
                  </div>
                )}
              </SectionContent>
            </Section>
          </MainContent>
        </ProfileLayout>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
