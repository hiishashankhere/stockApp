import moment from "moment"
import { Subscription } from "../models/subscription.js"
import { User } from "../models/user.js"
import cron from 'node-cron'


export const createPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const { isSubscribed, discount } = req.body
        const endingDate = await Subscription.find({ isSubscribed: true })
        let expirydates = null

        for (let setdate of endingDate) {
            let expiry
            if (setdate.duration === 'monthly') {
                expiry = moment(setdate.startDate).add(5, 'minutes')
            } else if (setdate.duration === 'half-yearly') {
                expiry = moment(setdate.startDate).add(6, 'months')
            } else if (setdate.duration === 'yearly') {
                expiry = moment(setdate.startDate).add(1, 'year')
            } else {
                console.log("Plan not available");
                continue
            }
            setdate.endDate = expiry.toDate()
            await setdate.save()
            expirydates = expiry
            //console.log(expirydates);
        }

        const plan = new Subscription({
            isSubscribed: req.body.isSubscribed,
            discount: req.body.discount,
            startDate: req.body.startDate,
            endDate: expirydates,
            user
        })

        await plan.save()
        res.status(200).json({
            success: true,
            message: "subscribed successfully",
            plan
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const renewPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const { duration, startDate } = req.body
        const newDate = new Date(startDate)
        let updateDate
        let currentDate

        const currentSubscription = await Subscription.findOne({ user })
        if (!currentSubscription) return res.status(404).json({
            success: false,
            message: "No active subscription found"
        })

        currentDate = currentSubscription.endDate ? moment(currentSubscription.endDate):moment(newDate)

        switch (duration) {
            case 'monthly':
                updateDate = currentDate.add(1, "M").toDate()
                break;
            case 'half-yearly':
                updateDate = currentDate.add(6, "M").toDate()
                break;
            case 'yearly':
                updateDate = currentDate.add(1, "year").toDate()
                break;
            default:
                throw new Error("invalid plan type")
        }

        currentSubscription.startDate = newDate
        currentSubscription.endDate = updateDate
        currentSubscription.save()

        
        res.status(200).json({
            success: true,
            message: "subscription updated"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const checkForSubscription = async (req, res) => {
    try {
        const dt = new Date();
        const expiredPlans = await Subscription.find({ endDate: { $lt: dt }, isSubscribed: true });
        for (let subscription of expiredPlans) {
            let newExpiry;

            if (subscription.duration === 'monthly') {
                newExpiry = moment(subscription.endDate).add(30, 'days');
            } else if (subscription.duration === 'half-yearly') {
                newExpiry = moment(subscription.endDate).add(6, 'months');
            } else if (subscription.duration === 'yearly') {
                newExpiry = moment(subscription.endDate).add(1, 'year');
            } else {
                console.log('Invalid plan duration');
                continue;
            }

            subscription.endDate = newExpiry.toDate();
            await subscription.save();
        }

        res.status(200).json({
            success: true,
            message: 'Subscriptions checked and renewed successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//cron.schedule('* * * * *',checkForSubscription)

