export const theme = {
  colors: {
    primary: {
      DEFAULT: '#8174A0', // 深紫色
      light: '#9485B0',   // 浅紫色
      dark: '#6E6390',    // 暗紫色
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
      DEFAULT: '#A888B5', // 淡紫色
      light: '#B599C0',   // 更淡紫色
      dark: '#9B77AA',    // 深淡紫色
    },
    accent: {
      DEFAULT: '#EFB6C8', // 粉色
      light: '#F4C5D4',   // 浅粉色
      dark: '#EAA7BC',    // 深粉色
    },
    background: {
      DEFAULT: '#FFD2A0', // 杏色
      light: '#FFE1BD',   // 浅杏色
      dark: '#FFC383',    // 深杏色
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

// 动画配置
export const animations = {
  // 页面转场动画
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  // 卡片悬浮动画
  cardHover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  // 图片加载动画
  imageLoad: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  // 列表项动画
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  },
};

// 响应式布局配置
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