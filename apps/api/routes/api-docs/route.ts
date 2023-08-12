import { Router } from 'express'
import redoc from 'redoc-express'

const router = Router()

// serve your swagger.json file
router.get('/api-docs/spec.json', (req, res) => {
  res.sendFile('generated/api-docs.json', { root: '.' })
})

router.get(
  '/api-docs',
  redoc({
    title: 'API Docs',
    specUrl: '/api-docs/spec.json',
    nonce: '', // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#6EC5AB',
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: '15px',
          lineHeight: '1.5',
          code: {
            code: '#87E8C7',
            backgroundColor: '#4D4D4E',
          },
        },
        menu: {
          backgroundColor: '#ffffff',
        },
      },
    },
  })
)

export default router
