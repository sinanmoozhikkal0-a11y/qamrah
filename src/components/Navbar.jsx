import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  // Handle sticky blur state on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'OUR STORY', path: '/our-story' },
    { name: 'WHOLESALE', path: '/wholesale' },
    { name: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 'var(--navbar-height)',
          backgroundColor: isScrolled
            ? 'rgba(7, 19, 13, 0.94)'
            : 'rgba(7, 19, 13, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled
            ? '1px solid rgba(199, 154, 74, 0.35)'
            : '1px solid rgba(199, 154, 74, 0.15)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Brand Logo */}
          <Logo size="medium" />

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                style={({ isActive }) => ({
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  letterSpacing: '0.14em',
                  color: isActive ? '#D8B66A' : 'var(--color-cream-base)',
                  position: 'relative',
                  padding: '8px 0',
                  transition: 'color 0.2s ease',
                  textTransform: 'uppercase'
                })}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          width: '100%',
                          height: '2px',
                          background: 'linear-gradient(90deg, #D8B66A, #C79A4A)',
                          borderRadius: '2px',
                          boxShadow: '0 0 8px rgba(216, 182, 106, 0.6)'
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px'
            }}
          >
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              style={{
                background: 'rgba(199, 154, 74, 0.08)',
                border: '1px solid rgba(199, 154, 74, 0.25)',
                color: 'var(--color-cream-base)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold-base)';
                e.currentTarget.style.color = 'var(--color-gold-base)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(199, 154, 74, 0.25)';
                e.currentTarget.style.color = 'var(--color-cream-base)';
              }}
            >
              <Search size={18} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              style={{
                background: 'rgba(199, 154, 74, 0.08)',
                border: '1px solid rgba(199, 154, 74, 0.25)',
                color: 'var(--color-cream-base)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold-base)';
                e.currentTarget.style.color = 'var(--color-gold-base)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(199, 154, 74, 0.25)';
                e.currentTarget.style.color = 'var(--color-cream-base)';
              }}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #D8B66A, #C79A4A)',
                    color: '#07130D',
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              style={{
                background: 'rgba(199, 154, 74, 0.08)',
                border: '1px solid rgba(199, 154, 74, 0.25)',
                color: 'var(--color-cream-base)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold-base)';
                e.currentTarget.style.color = 'var(--color-gold-base)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(199, 154, 74, 0.25)';
                e.currentTarget.style.color = 'var(--color-cream-base)';
              }}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #D8B66A, #C79A4A)',
                    color: '#07130D',
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-cream-base)',
                padding: '8px',
                cursor: 'pointer',
                display: 'none'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(var(--navbar-height) + var(--topbar-height))',
            left: 0,
            width: '100%',
            height: 'calc(100vh - var(--navbar-height) - var(--topbar-height))',
            backgroundColor: 'rgba(7, 19, 13, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            borderTop: '1px solid var(--color-gold-border)',
            animation: 'fadeInUp 0.3s ease forwards'
          }}
        >
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                style={({ isActive }) => ({
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--color-gold-base)' : 'var(--color-cream-base)',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(199, 154, 74, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                })}
              >
                <span>{link.name}</span>
                <span style={{ color: 'var(--color-gold-base)', opacity: 0.5 }}>→</span>
              </NavLink>
            ))}

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to={user ? '/login' : '/login'}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={16} />
                <span>{user ? `Account (${user.name})` : 'Sign In / Register'}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
