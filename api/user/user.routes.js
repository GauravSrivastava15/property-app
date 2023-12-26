import exprees from 'express'
import { signup } from './user.controller.js'

const router = exprees.Router()

router.post('/signup', signup )

export default router