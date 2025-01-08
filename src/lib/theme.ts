export const theme = {
  colors: {
    primary: {
      DEFAULT: '#8174A0', // Deep Purple
      light: '#9485B0',   // Light Purple
      dark: '#6E6390',    // Dark Purple
      50: '#F5F3F8',
      100: '#EBE7F1',
      200: '#D7CFE3',
      300: '#C3B7D5',
      400: '#AF9FC7',
      500: '#8174A0',
      600: '#6E6390',
      700: '#5B5280',
      800: '#484170',
      900: '#353060',
    },
    secondary: {
      DEFAULT: '#A888B5', // Soft Purple
      light: '#B599C0',   // Lighter Purple
      dark: '#9B77AA',    // Darker Purple
    },
    accent: {
      DEFAULT: '#EFB6C8', // Pink
      light: '#F4C5D4',   // Light Pink
      dark: '#EAA7BC',    // Dark Pink
    },
    background: {
      DEFAULT: '#FFD2A0', // Apricot
      light: '#FFE1BD',   // Light Apricot
      dark: '#FFC383',    // Dark Apricot
    }
  },
  fonts: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
  },
  spacing: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.5s ease-out',
    scaleIn: 'scaleIn 0.3s ease-out',
    hoverScale: 'transform 0.3s ease',
    hoverLift: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Animation Configuration
export const animations = {
  // Page Transition
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  // Card Hover
  cardHover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  // Image Loading
  imageLoad: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  // List Item
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  },
};

// Responsive Layout Configuration
export const responsive = {
  mobile: {
    maxWidth: '640px',
    padding: '1rem',
    fontSize: {
      base: '14px',
      heading: '20px',
    },
  },
  tablet: {
    maxWidth: '768px',
    padding: '1.5rem',
    fontSize: {
      base: '15px',
      heading: '24px',
    },
  },
  desktop: {
    maxWidth: '1280px',
    padding: '2rem',
    fontSize: {
      base: '16px',
      heading: '28px',
    },
  },
}; 