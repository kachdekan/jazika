import { extendTheme } from 'native-base';
import { colors } from './colors';

export const theme = extendTheme({
  colors,
  components: {
    Button: {
      baseStyle: {
        rounded: '3xl',
      },
      defaultProps: {
        size: 'lg',
      },
    },
  },
});
