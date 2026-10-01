'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchModal from './SearchModal';

export default function ClientLayoutWrapper({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname() || '/';
  const isAdmin = pathname.startsWith('/admin');

  // Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={isAdmin ? 'admin-root' : 'site-wrapper'}>
      {/* Customer Header - hidden on /admin */}
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      {/* Main Page Content */}
      <main className={isAdmin ? 'admin-main-wrapper' : 'main-content'}>
        {children}
      </main>

      {/* Customer Footer - hidden on /admin */}
      {!isAdmin && <Footer />}

      {/* Global Live Search Modal - hidden on /admin */}
      {!isAdmin && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
}
