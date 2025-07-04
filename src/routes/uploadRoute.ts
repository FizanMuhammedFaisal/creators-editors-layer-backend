import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

const router = express.Router();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


router.post('/', async (req, res) => {
    try{
        const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        res.status(400).json({ error: 'fileName and fileType required' });
        return
    }

    const key = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType
    });

    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    res.json({
        uploadURL,
        key,
        bucket: process.env.S3_BUCKET_NAME
    });

    }catch(error){
        console.error('Error generating upload URL:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
})

router.get('/:key', async (req, res) => {
    try{
        const { key } = req.params;
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        res.redirect(url);
    }catch(error){
        console.error('Error getting file:', error);
        res.status(500).json({ error: 'Failed to get file' });
    }
})



export default router;