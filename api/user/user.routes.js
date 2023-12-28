import exprees from 'express'
import { google, signin, signup } from './user.controller.js'

const router = exprees.Router()

router.post('/signup', signup )
router.post('/signin', signin)
router.post('/google', google)

export default router