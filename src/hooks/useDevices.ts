import useMediaQuery from "./useMediaQuery";

const VIEW = {
  xxl: `(min-width: 1536px)`,
  xl: `(min-width: 1280px)`,
  lg: `(min-width: 1024px)`,
  md: `(min-width: 768px)`,
  sm: `(min-width: 640px)`,
  xs: `(min-width: 360px)`,
};

const MAX = {
  xxl: `not all and (min-width: 1536px)`,
  xl: `not all and (min-width: 1280px)`,
  lg: `not all and (min-width: 1024px)`,
  md: `not all and (min-width: 768px)`,
  sm: `not all and (min-width: 640px)`,
  xs: `not all and (min-width: 360px)`,
};

export const useDevices = () => {
  const isLargeDesktop = useMediaQuery(MAX.xxl); // Screens smaller than 1536px
  const isDesktop = useMediaQuery(MAX.xl); // Screens smaller than 1280px
  const isTablet = useMediaQuery(MAX.lg); // Screens smaller than 1024px
  const isLargeMobile = useMediaQuery(MAX.md); // Screens smaller than 768px
  const isMobile = useMediaQuery(MAX.sm); // Screens smaller than 640px
  const isSmallMobile = useMediaQuery(MAX.xs); // Screens smaller than 360px

  const isXLargeDesktop = useMediaQuery(VIEW.xxl); // Screens 1536px and larger
  const isLargeDesktopView = useMediaQuery(VIEW.xl); // Screens 1280px and larger
  const isTabletView = useMediaQuery(VIEW.lg); // Screens 1024px and larger
  const isLargeMobileView = useMediaQuery(VIEW.md); // Screens 768px and larger
  const isMobileView = useMediaQuery(VIEW.sm); // Screens 640px and larger
  const isSmallMobileView = useMediaQuery(VIEW.xs); // Screens 360px and larger

  return {
    isLargeDesktop,
    isDesktop,
    isTablet,
    isLargeMobile,
    isMobile,
    isSmallMobile,
    isXLargeDesktop,
    isLargeDesktopView,
    isTabletView,
    isLargeMobileView,
    isMobileView,
    isSmallMobileView,
  };
};
