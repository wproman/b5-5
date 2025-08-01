/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import { User } from '../modules/users/user.models';


// passport.use(
//     new GoogleStrategy (
//         {
//             clientID: envVars.GOOGLE_CLIENT_ID as string,
//             clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
//             callbackURL: envVars.GOOGLE_CALLBACK_URL as string
//         }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => { 
//             try {
//                 const email = profile.emails?.[0].value
//                 if(!email) {
//                     return done(null, false, {message: "no email found"})
//                 }

//                 let user = await User.findOne({email})
//                 if(!user) {
//                     user = await User.create({
//                         email,
//                         name: profile.displayName,
//                         picture: profile.photos?.[0].value,
//                         role: UserRole.USER,
//                         isVerified: true,
//                         auths: [
//                             {
//                                 provider: "google",
//                                 providerId: profile.id
//                             }
//                         ]
//                     })
//                 }

//                 return done(null, user)
//             } catch (error) {
//             // console.log("Google stategy error", error)
//                 return done(error)
//             }
//           }
//     )
// )

// localhost frontent : 5173  --> localhost:5000/api/v1/auth/google ---> passport--> google Oauth concent screen -->gmail login --> success -->localhost:5000/api/v1/auth/google/ callback
// bridge
//custom--> email, password

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
})

passport.deserializeUser(async(id:string, done: any)=>{
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})