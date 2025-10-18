# LawLink API Contract v1.0

## Base URL
`/api/v1`

## Endpoints

### Chat
- `POST /chat/message` - Send message, get AI response
```json
  Request: { "message": "string", "caseId": "string?" }
  Response: { "id": "string", "content": "string", "sender": "ai", "timestamp": "ISO8601" }
```

- `GET /chat/history/:caseId` - Get conversation history
```json
  Response: [{ "id": "string", "content": "string", "sender": "client|ai", "timestamp": "ISO8601" }]
```

### Cases
- `GET /cases` - List all cases
```json
  Response: [{ "id": "string", "clientName": "string", "summary": "string", "status": "active|pending|closed", "createdAt": "ISO8601" }]
```

- `POST /cases` - Create new case
```json
  Request: { "clientName": "string" }
  Response: { "id": "string", "clientName": "string", "status": "active", "createdAt": "ISO8601" }
```

- `GET /cases/:id` - Get case details
```json
  Response: { "id": "string", "clientName": "string", "summary": "string", "messages": [...], "status": "string", "createdAt": "ISO8601" }
```

## Response Format
All responses follow:
```json
{
  "success": true|false,
  "data": { ... },
  "error": { "code": "string", "message": "string" }?
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error