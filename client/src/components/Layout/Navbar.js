import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(217, 119, 6, 0.1);
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d97706;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #b45309;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d97706, #b45309);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: white;
  font-size: 1.2rem;
  background-image: url('${props => props.bgImage || ''}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  outline: none;

  &:hover, &:focus {
    color: #d97706;
    background: rgba(217, 119, 6, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0.75rem;
    width: calc(100% - 1.5rem);
    height: 2px;
    background: #d97706;
    transition: transform 0.3s ease;
    transform: scaleX(0);
    transform-origin: left;
  }

  &:hover::after, &:focus::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.3);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LanguageSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #d97706;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &.primary {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: white;
    box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(217, 119, 6, 0.3);
    }
  }

  &.secondary {
    color: #d97706;
    border-color: #d97706;

    &:hover {
      background: #d97706;
      color: white;
    }
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #b45309);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #fef2f2;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #374151;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  outline: none;
  
  &:focus-visible {
    background: rgba(217, 119, 6, 0.1);
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.3);
  }
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          शिल्पकारी
        </Logo>

        <NavLinks>
          <NavLink to="/">{t('navigation.home')}</NavLink>
          <NavLink to="/products">{t('navigation.products')}</NavLink>
          <NavLink to="/artisans">{t('navigation.artisans')}</NavLink>
          <NavLink to="/about">{t('navigation.about')}</NavLink>
          <NavLink to="/contact">{t('navigation.contact')}</NavLink>
        </NavLinks>

        <UserMenu>
          <LanguageSelector value={currentLanguage} onChange={handleLanguageChange}>
            {getAvailableLanguages().map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </LanguageSelector>

          {isAuthenticated ? (
            <UserDropdown>
              <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                <UserAvatar>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </UserAvatar>
                <span>{user?.name}</span>
              </UserButton>

              <AnimatePresence>
                {showUserMenu && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem to="/dashboard">{t('navigation.dashboard')}</DropdownItem>
                    <DropdownItem to="/orders">{t('navigation.orders')}</DropdownItem>
                    <DropdownItem to="/profile">{t('navigation.profile')}</DropdownItem>
                    {user?.role === 'artisan' && (
                      <>
                        <DropdownItem to="/artisan/add-product">Add Product</DropdownItem>
                        <DropdownItem to={`/artisan/${user.id || user._id}`}>My Products</DropdownItem>
                      </>
                    )}
                    <LogoutButton onClick={handleLogout}>
                      {t('navigation.logout')}
                    </LogoutButton>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </UserDropdown>
          ) : (
            <AuthButtons>
              <Button to="/login" className="secondary">
                {t('navigation.login')}
              </Button>
              <Button to="/register" className="primary">
                {t('navigation.register')}
              </Button>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            ☰
          </MobileMenuButton>
        </UserMenu>
      </NavContent>

      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavLink to="/">{t('navigation.home')}</MobileNavLink>
            <MobileNavLink to="/products">{t('navigation.products')}</MobileNavLink>
            <MobileNavLink to="/artisans">{t('navigation.artisans')}</MobileNavLink>
            <MobileNavLink to="/about">{t('navigation.about')}</MobileNavLink>
            <MobileNavLink to="/contact">{t('navigation.contact')}</MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard">{t('navigation.dashboard')}</MobileNavLink>
                <MobileNavLink to="/orders">{t('navigation.orders')}</MobileNavLink>
                <MobileNavLink to="/profile">{t('navigation.profile')}</MobileNavLink>
                {user?.role === 'artisan' && (
                  <>
                    <MobileNavLink to="/artisan/add-product">Add Product</MobileNavLink>
                    <MobileNavLink to={`/artisan/${user.id || user._id}`}>My Products</MobileNavLink>
                  </>
                )}
                <MobileNavLink to="#" onClick={handleLogout}>{t('navigation.logout')}</MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">{t('navigation.login')}</MobileNavLink>
                <MobileNavLink to="/register">{t('navigation.register')}</MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
