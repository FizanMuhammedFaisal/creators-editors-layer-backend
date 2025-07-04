import { Router } from 'express';
import {Request, Response} from 'express'
import type { users as User, workspaces as Workspace } from '../generated/prisma/client.js';
import {db} from '../db/index.js'

import { ApiResponse } from '../types/api.js';

const router = Router();

interface WorkspaceRequest extends Request {
    user?:User
}

//create workspace -> get workspace by id -> get submissions of a workspace -> 

// GET all workspaces
router.get('/', async (req:WorkspaceRequest, res:any) => {
    const user = req.user!

    const workspaces = await db.workspaces.findMany({
        where:{
            OR:[
                { creator_id: user.id },
                {workspace_members:{some:{user_id:user.id}}}
            ]
        }
    })

    res.status(200).json(workspaces);
});

//create a workspace
router.post('/', async (req:Request, res:any) => {
    const user = req.user!
    const {name, channel_id} = req.body

    const exits = await db.workspaces.findFirst({
        where:{
                name,
                creator_id: user.id,
        }
    })

    if (exits){
        return res.status(409).json({success:false, error:{message: "the workspace name already exists, try another name"}});
    }

    const workspace = await db.workspaces.create({
        data:{
            name,
            creator_id:user.id,
            youtube_channel_id:channel_id
        }
    })
  return res.status(201).json({ success: true, data: workspace });
});

//get submission from workspace a specific workspace
router.get('/:id/submissions', async(req:Request, res:any)=>{
    const user = req.user!
    const { id } = req.params

    //check if the user has access
    const hasAccess = await db.workspaces.findFirst({
        where:{
            id,
            OR:[
                {creator_id:user.id},
                {workspace_members:{some:{user_id:user.id}}}
            ]
        }
    })

    if (!hasAccess) {
     res.status(403).json({ error: 'Access denied: Not a member of this workspace.' });
     return
    }

    //check if the user belongs to a workspace and return all submissions
    const submissions = await db.submissions.findMany({
        where:{ workspace_id:id },
        orderBy:{submitted_at:'desc'}
    })

    

    return res.status(200).json({ success: true, data: submissions })

})

router.get('/:workspaceId/submissions/:submissionId', async(req:Request, res:any)=>{
    const user = req.user!
    const { workspaceId, submissionId } = req.params

    //check if the user has access
    const hasAccess = await db.workspaces.findFirst({
        where:{
            id:workspaceId,
            OR:[
                {creator_id:user.id},
                {workspace_members:{some:{user_id:user.id}}}
            ]
        }
    })

    if (!hasAccess) {
     res.status(403).json({ error: 'Access denied: Not a member of this workspace.' });
     return
    }

    const submission = await db.submissions.findFirst({
        where:{
            id:submissionId,
            workspace_id:workspaceId
        }
    })

    if (!submission) {
        return res.status(404).json({ success: false, error: 'Submission not found' })
    }

    return res.status(201).json({ success: true, data: submission });

})

router.post('/:workspaceId/submissions', async(req:Request, res:any)=>{
    const user = req.user!
    const { workspaceId } = req.params
    const {title, description, video_url, thumbnail_url} = req.body

    //check if the user has access
    const hasAccess = await db.workspaces.findFirst({
        where:{
            id:workspaceId,
            OR:[
                {creator_id:user.id},
                {workspace_members:{some:{user_id:user.id}}}
            ]
        }
    })

    if (!hasAccess) {
     res.status(403).json({ error: 'Access denied: Not a member of this workspace.' });
     return
    }

    //create a submission
    const submission = await db.submissions.create({
        data: {
            workspace_id: workspaceId,
            uploader_id: user.id,
            title,
            description,
            video_url,
            thumbnail_url,
            status: 'pending'
        }
    })

    res.status(201).json({success:true, data:submission})
})

router.post('/workspaces/:workspaceId/submissions/:submissionId/approve', async(req:Request,res:any)=>{
    const user = req.user!
    const { workspaceId, submissionId } = req.params

    //check if the user has access
    const hasAccess = await db.workspaces.findFirst({
        where:{
            id:workspaceId,
            OR:[
                {creator_id:user.id}
            ]
        }
    })

    if (!hasAccess) {
        res.status(403).json({ error: 'Access denied: Not the owner of this workspace.' });
        return
    }

    const updated = await db.submissions.update({
            where:{id:submissionId},
            data:{
                status:"approved"
            }
        })

        return res.status(200).json({ success: true, data: updated });
})


router.post('/workspaces/:workspaceId/submissions/:submissionId/reject', async(req:Request,res:any)=>{
    const user = req.user!
    const { workspaceId, submissionId } = req.params

    //check if the user has access
    const hasAccess = await db.workspaces.findFirst({
        where:{
            id:workspaceId,
            OR:[
                {creator_id:user.id}
            ]
        }
    })

    if (!hasAccess) {
        res.status(403).json({ error: 'Access denied: Not the owner of this workspace.' });
        return
    }

    const updated = await db.submissions.update({
            where:{id:submissionId},
            data:{
                status:"rejected"
            }
        })

        return res.status(200).json({ success: true, data: updated });
})


export default router;
