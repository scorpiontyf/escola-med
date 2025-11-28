/**
 * Hook useResponsive - Layout Responsivo
 * 
 * Detecta o tamanho da tela e retorna informações para adaptar o layout.
 */

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

const BREAKPOINTS = {
  sm: 0,      // Mobile pequeno
  md: 375,    // Mobile
  lg: 768,    // Tablet
  xl: 1024,   // Tablet landscape / Desktop
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

interface ResponsiveInfo {
  width: number;
  height: number;
  
  breakpoint: Breakpoint;
  
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  
  columns: 1 | 2 | 3 | 4;
  
  padding: number;
  
  select: <T>(options: Partial<Record<Breakpoint, T>> & { default: T }) => T;
}

/**
 * Hook para layout responsivo
 */
export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setDimensions(window);
      }
    );

    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;

  const getBreakpoint = (): Breakpoint => {
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    return 'sm';
  };

  const breakpoint = getBreakpoint();

  const isMobile = breakpoint === 'sm' || breakpoint === 'md';
  const isTablet = breakpoint === 'lg';
  const isDesktop = breakpoint === 'xl';
  const isPortrait = height > width;
  const isLandscape = width > height;

  const getColumns = (): 1 | 2 | 3 | 4 => {
    switch (breakpoint) {
      case 'xl': return 4;
      case 'lg': return isLandscape ? 3 : 2;
      case 'md': return isLandscape ? 2 : 1;
      default: return 1;
    }
  };

  const getPadding = (): number => {
    switch (breakpoint) {
      case 'xl': return 32;
      case 'lg': return 24;
      case 'md': return 16;
      default: return 12;
    }
  };

  const select = <T,>(options: Partial<Record<Breakpoint, T>> & { default: T }): T => {
    if (options[breakpoint] !== undefined) {
      return options[breakpoint] as T;
    }
    
    const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm'];
    const currentIndex = breakpointOrder.indexOf(breakpoint);
    
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (options[bp] !== undefined) {
        return options[bp] as T;
      }
    }
    
    return options.default;
  };

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    columns: getColumns(),
    padding: getPadding(),
    select,
  };
}

/**
 * Hook simplificado para número de colunas
 */
export function useColumns(
  options: { sm?: number; md?: number; lg?: number; xl?: number } = {}
): number {
  const { breakpoint } = useResponsive();
  const defaults = { sm: 1, md: 1, lg: 2, xl: 3 };
  const merged = { ...defaults, ...options };
  return merged[breakpoint];
}

/**
 * Hook para detectar orientação
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const { isPortrait } = useResponsive();
  return isPortrait ? 'portrait' : 'landscape';
}