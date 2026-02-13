// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Keep ESLint consistent with .prettierrc ("arrowParens": "avoid").
    '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }]
  }
})
