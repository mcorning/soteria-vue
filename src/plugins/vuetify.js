import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader

Vue.use(Vuetify, {
  iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
});
export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red.darken2,
        secondary: colors.red.lighten3,
        accent: colors.shades.black,
        error: colors.red.accent3
      },
      dark: {
        primary: colors.blue.lighten3
      }
    }
  }
});
