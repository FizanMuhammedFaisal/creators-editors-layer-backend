import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

const router = express.Router();

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

router.post('/upload', async (req, res) => {
    try{
        const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        res.status(400).json({ error: 'fileName and fileType required' });
        return
    }

    const key = `${uuidv4()}-${fileName}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: 900, // 15 minutes
        ContentType: fileType,
        Conditions: [
          ['content-length-range', 0, 4294967296] // 4GB max
        ]
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

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

export default router;