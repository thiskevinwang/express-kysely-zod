import { Router } from 'express'

import { StreamController } from '@/controllers/stream.controller'

export default Router().get('/stream', StreamController.getStream.handler())
