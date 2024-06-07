import { User } from "../models/user.js"
import bcrypt from 'bcrypt'
import otp from 'otp-generator'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(404).json({
            success: false,
            message: "user already exists"
        })
        const newOtp = otp.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        const referalCode = otp.generate(5, { specialChars: false, digits: false })
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            image: req.body.image,
            otp: newOtp,
            referalcode: referalCode
        })
        user.password = await bcrypt.hash(user.password, 10)
        const response = await sendOtp(user.mobile, newOtp)
        await user.save()

        res.status(201).json({
            success: true,
            message: "user registered successfully",
            response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const sendOtp = async (mobile, otp) => {
    const response = {
        mobile, otp,
        message: `Your OTP is ${otp}`
    }
    return response

}

export const login = async (req, res) => {
    try {
        const { mobile, otp } = req.body
        const otpDetail = await User.findOne({ mobile, otp })
        if (!otpDetail) return res.status(404).json({
            success: false,
            message: "invalid or expired OTP"
        })
        let user = await User.findOne({ mobile })
        if (!user) {
            user = await User.create({ mobile })
        }
        // await User.deleteOne({mobile,otp})
        const token = await jwt.sign({ _id: user._id }, 'shashank singh')
        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }).json({
            success: true,
            message: "logged in successfully!!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        let user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })
         
        user.otp = null
        await user.save()
        res.status(200).cookie("token", '', {
            expires: new Date(Date.now())
        }).json({
            success: true,
            message: "logout successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const userUpdate = async (req, res) => {
    try {
        const newDetails = await User.findByIdAndUpdate(req.params.id, req.body)
        if (!newDetails) return res.status(404).json({
            success: false,
            message: "user not found"
        })
        res.status(200).json({
            success: true,
            message: "user details updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

