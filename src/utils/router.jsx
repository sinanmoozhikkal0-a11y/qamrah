'use client';

import React, { forwardRef, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';

export const Link = forwardRef(({ to, href, children, ...props }, ref) => {
  const target = to || href || '#';
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

export const NavLink = forwardRef(({ to, href, end, children, className, style, ...props }, ref) => {
  const pathname = usePathname() || '/';
  const target = to || href || '#';
  const isActive = end ? pathname === target : pathname.startsWith(target) && target !== '/';

  const resolvedClass = typeof className === 'function' ? className({ isActive }) : className;
  const resolvedStyle = typeof style === 'function' ? style({ isActive }) : style;
  const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;

  return (
    <NextLink ref={ref} href={target} className={resolvedClass} style={resolvedStyle} {...props}>
      {resolvedChildren}
    </NextLink>
  );
});
NavLink.displayName = 'NavLink';

export const useNavigate = () => {
  const router = useRouter();
  return (to, options) => {
    if (to === -1) {
      router.back();
    } else if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname() || '/';
  const searchParams = useNextSearchParams();
  const searchStr = searchParams?.toString();
  return {
    pathname,
    search: searchStr ? `?${searchStr}` : '',
    hash: ''
  };
};

export const useParams = () => {
  const params = useNextParams();
  return params || {};
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname() || '/';

  const setSearchParams = (updater) => {
    const nextParams = new URLSearchParams(typeof updater === 'function' ? updater(searchParams) : updater);
    router.replace(`${pathname}?${nextParams.toString()}`);
  };

  return [searchParams, setSearchParams];
};

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
};

export const Outlet = ({ children }) => children || null;
export const Route = () => null;
export const Routes = ({ children }) => children || null;

