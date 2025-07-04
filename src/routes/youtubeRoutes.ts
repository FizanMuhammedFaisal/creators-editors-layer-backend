import { Router } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import { db } from '../db/index.js';
const router = Router();
import { Request } from 'express';
import { authMiddleware } from '../middleware/auth.js';
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

router.get('/youtube', (req,res)=>{
    const authUrl = oauth2Client.generateAuthUrl({
        access_type:'offline',
        scope:['https://www.googleapis.com/auth/youtube.upload']
    })

    res.redirect(authUrl)
})

router.get('/oauth2callback',authMiddleware, async(req:Request, res:any)=>{
    try {
        const user = req.user
        const { code } = req.query;
        const {tokens} = await oauth2Client.getToken(code as string)
        oauth2Client.setCredentials(tokens)

        const uploadCredsToDb = await db.users.update({
            where:{id:user.id},
            data:{
                youtube_access_token:tokens.access_token,
                youtube_refresh_token: tokens.refresh_token,
            }
        })

        res.redirect('http://localhost:3000/dashboard?auth=success');
    }catch(error){
        res.redirect('http://localhost:3000/dashboard?auth=error');
    }

    return res.status(200).json({ message: "YouTube connected successfully." });

})

export default router