import exprees from 'express'
import { google, signin, signup, updateUser } from './user.controller.js'
import {auth} from '../middlewares/jwtAuth.js'

const router = exprees.Router()

router.post('/signup', signup )
router.post('/signin', signin)
router.post('/google', google)
router.post('/update/:id', auth, updateUser)

export default router