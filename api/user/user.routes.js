import exprees from 'express'
import { signin, signup } from './user.controller.js'

const router = exprees.Router()

router.post('/signup', signup )
router.post('/signin', signin)

export default router