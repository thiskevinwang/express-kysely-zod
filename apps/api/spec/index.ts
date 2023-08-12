import * as fs from 'fs'
import * as path from 'path'

import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import * as prettier from 'prettier'

import { StreamController } from '@/controllers/stream.controller'
import { UsersController } from '@/controllers/users.controller'

import { registry } from './registry'

const API_VERSION = process.env.API_VERSION || '0.0.0'

// To preview docs @ http://localhost:8080, run:
// - npm run docs:preview
// - ts-node --esm src/spec/index.ts && npx -p @redocly/cli redocly preview-docs
async function main() {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  const document = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      version: API_VERSION,
      title: 'TEST API',
      description: `

# Introduction
...

# Authentication

There are two notable forms of authentication:
  - GitHub Token
  - Admin Token

<SecurityDefinitions />
`,
    },
    servers: [{ url: 'http://localhost:5000', description: 'development' }],
    // security: [{ [repoToken.name]: [] }],
    tags: [UsersController.spec.tag, StreamController.spec.tag],
  })

  const jsonBlob = JSON.stringify(document)
    // Ensure all path params — ":variable-group-config"
    // are formatted as       — "{variable_group_config}"
    // to match openapi spec.
    .replaceAll(/\/:([a-z_-]+)/g, (val) => {
      return val.replace(':', '{').replaceAll('-', '_') + '}'
    })
  fs.writeFileSync(
    './generated/api-docs.json',
    await prettier.format(jsonBlob, { parser: 'json' })
  )
}

main()
