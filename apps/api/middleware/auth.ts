import { type RequestHandler } from 'express'
import { createRemoteJWKSet, decodeJwt, errors, jwtVerify } from 'jose'

async function validateJWT(jwt: string) {
  if (!jwt) {
    return null
  }

  // decode the JWT. This will eventually get returned by this function
  const payload = decodeJwt(jwt)
  // get issuer from the JWT to construct the jwks endpoint
  const iss = payload.iss

  const jwksUri = new URL('.well-known/jwks.json', iss)
  const JWKS = createRemoteJWKSet(jwksUri)
  await jwtVerify(jwt, JWKS)
  return payload
}

/**
 * This middleware does 2 things
 * 1. Decodes a JWT in the Authorization header
 * 2. Validates the JWT against the issuer's JWKS endpoint
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(404).end()
  }

  const [_bearer, jwt] = authHeader.split(' ')

  if (!jwt) {
    return res.status(404).end()
  }

  try {
    const result = await validateJWT(jwt)
    if (!result) {
      return res.status(404).end()
    }
    next()
  } catch (err: any) {
    console.error("[authMiddleware]: couldn't validate JWT", err.message)
    if (err instanceof errors.JOSEError) {
      if (err.code == 'ERR_JWT_EXPIRED') {
        return res.status(401).json({
          message: 'Please log in and try again',
        })
      }
      return res.status(500).json(err)
    } else {
      return res.status(500).json(err)
    }
  }
}
