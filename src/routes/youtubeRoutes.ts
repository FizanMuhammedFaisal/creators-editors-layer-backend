import { Router } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import { db } from '../db/index.js';
const router = Router();
import { Request } from 'express';
import { authMiddleware } from '../middleware/auth.js';

const youtube = google.youtube('v3');

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

        const channelResponse = await youtube.channels.list({
        auth: oauth2Client,
  mine: true,
  part: ['id','snippet']
});
const channel = channelResponse.data.items[0];
const channelId = channel.id;
const channelName = channel.snippet.title;

        const uploadCredsToDb = await db.youtube_channels.upsert({
            where: {
                user_id_channel_id: {
                    user_id: user.id,
                    channel_id: channel.id
                }
            },
            create: {
                user_id: user.id,
                channel_id: channel.id,
                channel_name: channel.snippet.title,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            },
            update: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            }
        })

        res.status(200).json(`${process.env.FRONTEND_URL}/dashboard/org-add?auth=success`);
    }catch(error){
        res.status(200).json(`${process.env.FRONTEND_URL}/dashboard/org-add?auth=error`);
    }

})

//youtube channel name
router.get('/me', authMiddleware, async (req, res) => {
    const user = req.user;
    const channel = await db.youtube_channels.findFirst({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' },
        select: { channel_id: true, channel_name: true }
    });
    res.json({ channel });
});

export default router