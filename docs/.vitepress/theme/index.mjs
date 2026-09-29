import DefaultTheme from 'vitepress/theme'

import DemoPreview from './components/DemoPreview.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoPreview', DemoPreview)
  }
}
