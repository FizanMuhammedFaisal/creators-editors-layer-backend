YuFlow - YouTube Workflow Platform

Building the future of content creation workflows

A blazing-fast API for managing YouTube content workflows, submissions, and automated publishing. Built for creators who ship fast and iterate faster.

Vision
------
Problem: Content creators waste hours managing submissions, approvals, and publishing workflows.
Solution: YuFlow - A seamless platform that automates the entire content pipeline from submission to YouTube upload.

Tech Stack
----------
Runtime: Node.js + TypeScript
Database: PostgreSQL + Prisma ORM
Auth: Supabase Auth
YouTube Integration: Google OAuth2 + YouTube Data API
Deployment: Ready for Vercel/Railway

Quick Start
-----------
Clone and setup:
  git clone <repo>
  cd backend
  npm install

Environment setup:
  cp .env.example .env
  (Add your Supabase and YouTube API keys)

Database setup:
  npx prisma generate
  npx prisma db push

Start development:
  npm run dev

API Documentation
-----------------

Authentication
All endpoints (except OAuth) require a valid JWT token in the Authorization header:
  Authorization: Bearer <your-jwt-token>

Health Check
  GET /health
  Response: OK

Workspaces
----------
Get All Workspaces
  GET /api/workspaces
  Response: List of workspaces

Create Workspace
  POST /api/workspaces
  Headers: Content-Type: application/json, Authorization: Bearer <jwt-token>
  Body: { name: "My Channel Workspace", channel_id: "UC123...", channel_name: "My Channel" }
  Response: Workspace object
  Note: channel_id is required and should be obtained from /api/youtube/me after linking a channel.

Submissions
-----------
Get Workspace Submissions
  GET /api/workspaces/{workspaceId}/submissions
  Response: List of submissions

Get Single Submission
  GET /api/workspaces/{workspaceId}/submissions/{submissionId}

Create Submission
  POST /api/workspaces/{workspaceId}/submissions
  Body: { title, description, video_url, thumbnail_url }

Approve Submission
  POST /api/workspaces/{workspaceId}/submissions/{submissionId}/approve
  Response: Submission object with status approved

Reject Submission
  POST /api/workspaces/{workspaceId}/submissions/{submissionId}/reject

YouTube OAuth
-------------
Initiate OAuth Flow
  GET /api/oauth/auth/youtube
  Response: 302 redirect to Google OAuth consent screen

Complete OAuth Flow
  GET /api/oauth/oauth2callback?code={auth_code}
  Authorization: Bearer <jwt-token>
  Response: Redirects to frontend dashboard with success/error status

Get Latest Linked YouTube Channel
  GET /api/youtube/me
  Headers: Authorization: Bearer <jwt-token>
  Response: { channel: { channel_id, channel_name } }
  Returns the latest YouTube channel linked by the authenticated user.

Upload API
----------
Generate Signed Upload URL
  POST /api/upload
  Headers: Content-Type: application/json, Authorization: Bearer <jwt-token>
  Body: { fileName: "yourfile.txt", fileType: "text/plain" }
  Response: { uploadURL, key, bucket }

Upload File to S3
  PUT <uploadURL>
  Headers: Content-Type: <fileType>
  Body: (raw file data)
  Response: 200 OK if successful

Access Uploaded File
  GET /api/upload/{key}
  Headers: Authorization: Bearer <jwt-token>
  Response: Redirects to a signed S3 download URL for the file

Product Flow
------------
1. YouTuber pays you -> needs approval system working
2. Approval system -> needs submissions to approve
3. Submissions -> need workspace to belong to
4. Workspace -> needs users who can create it

Development
-----------
Scripts:
  npm run dev          Start development server with hot reload
  npm run build        Build for production
  npm run start        Start production server
  npm run prisma:generate  Generate Prisma client

Environment Variables
---------------------
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/oauth/oauth2callback

Metrics That Matter
-------------------
Time to first approval: < 5 minutes
API response time: < 200ms
Uptime: (not deployed yet)
User satisfaction: Through the roof

Built with love by the YuFlow team. Ship fast, iterate faster. 