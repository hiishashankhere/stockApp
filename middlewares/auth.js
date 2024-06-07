import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) return res.status(404).json({
            success: false,
            message: "login first"
        })
        const decoded = await jwt.verify(token,'shashank singh')
        req.user = await User.findById(decoded._id)
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}