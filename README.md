# 🚀 YuFlow - YouTube Workflow Platform

*Building the future of content creation workflows*

A blazing-fast API for managing YouTube content workflows, submissions, and automated publishing. Built for creators who ship fast and iterate faster.

## 🎯 The Vision

**Problem**: Content creators waste hours managing submissions, approvals, and publishing workflows.

**Solution**: YuFlow - A seamless platform that automates the entire content pipeline from submission to YouTube upload.

## 🛠 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Supabase Auth
- **YouTube Integration**: Google OAuth2 + YouTube Data API
- **Deployment**: Ready for Vercel/Railway

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo>
cd backend
npm install

# Environment setup
cp .env.example .env
# Add your Supabase and YouTube API keys

# Database setup
npx prisma generate
npx prisma db push

# Start development
npm run dev
```

## 📚 API Documentation

### Authentication
All endpoints (except OAuth) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Health Check
```http
GET /health
```
**Response**: `"OK"`

---

### 🏢 Workspaces

#### Get All Workspaces
```http
GET /api/workspaces
```
**Response**:
```json
[
  {
    "id": "uuid",
    "name": "My Channel",
    "creator_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Workspace
```http
POST /api/workspaces
Content-Type: application/json

{
  "name": "My New Workspace"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My New Workspace",
    "creator_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 📝 Submissions

#### Get Workspace Submissions
```http
GET /api/workspaces/{workspaceId}/submissions
```
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Amazing Video",
      "description": "Check this out!",
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "status": "pending",
      "uploader_id": "user-uuid",
      "submitted_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Single Submission
```http
GET /api/workspaces/{workspaceId}/submissions/{submissionId}
```

#### Create Submission
```http
POST /api/workspaces/{workspaceId}/submissions
Content-Type: application/json

{
  "title": "My Video Title",
  "description": "Video description",
  "video_url": "https://example.com/video.mp4",
  "thumbnail_url": "https://example.com/thumb.jpg"
}
```

#### Approve Submission
```http
POST /api/workspaces/{workspaceId}/submissions/{submissionId}/approve
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Reject Submission
```http
POST /api/workspaces/{workspaceId}/submissions/{submissionId}/reject
```

---

### 🔐 YouTube OAuth

#### Initiate OAuth Flow
```http
GET /api/oauth/auth/youtube
```
**Response**: 302 redirect to Google OAuth consent screen

#### Complete OAuth Flow
```http
GET /api/oauth/oauth2callback?code={auth_code}
Authorization: Bearer <jwt-token>
```
**Response**: Redirects to frontend dashboard with success/error status

---

## 🎯 Product Flow

Think of your product flow backwards from the money:

1. **💰 YouTuber pays you** → needs approval system working
2. **✅ Approval system** → needs submissions to approve  
3. **📝 Submissions** → need workspace to belong to
4. **🏢 Workspace** → needs users who can create it

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# YouTube OAuth
YOUTUBE_CLIENT_ID="..."
YOUTUBE_CLIENT_SECRET="..."
YOUTUBE_REDIRECT_URI="http://localhost:3000/api/oauth/oauth2callback"
```


## 📈 Metrics That Matter

- **Time to first approval**: < 5 minutes
- **API response time**: < 200ms
- **Uptime**:(not deployed yet)
- **User satisfaction**: Through the roof 🚀

---

*Built with ❤️ by the YuFlow team. Ship fast, iterate faster.* 