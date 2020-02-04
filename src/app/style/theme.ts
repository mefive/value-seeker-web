export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export default {
  spacing: (value: number) => value * 8,
  palette: {
    primary: '#1890ff',
    link: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    heading: 'rgba(0, 0, 0, .85)',
    text: 'rgba(0, 0, 0, .65)',
    textSecondary: 'rgba(0, 0, 0, .45)',
    disabled: 'rgba(0, 0, 0, .25)',
    border: 'rgba(229, 229, 241, 1)',
  },
  shadows: ['0 2px 8px rgba(0, 0, 0, .15)'],
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

    up: function up(key: keyof typeof breakpoints) {
      return `@media (min-width:${breakpoints[key]}px)`;
    },
  },
  zIndex: {
    tableFixed: 'auto',
    affix: 10,
    backTop: 10,
    badge: 10,
    pickerPanel: 10,
    popupClose: 10,
    modal: 1001,
    modalMask: 1001,
    message: 1010,
    notification: 1010,
    popover: 1030,
    dropdown: 1050,
    picker: 1050,
    tooltip: 1060,
  },
};
