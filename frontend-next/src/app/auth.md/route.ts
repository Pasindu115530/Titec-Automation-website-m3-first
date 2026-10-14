/**
 * /auth.md — Agent Registration Discovery
 *
 * Serves an Auth.md document describing the TiTEC API authentication
 * system for AI agent registration and credential provisioning.
 *
 * @see https://docs.auth.md/
 */
export function GET() {
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk'
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'

    const markdown = `# auth.md

> Authentication documentation for **TiTEC Automation API** agents.

## Overview

TiTEC Automation provides a REST API for accessing product catalogs, project portfolios, service listings, and submitting quotation requests. Authentication uses **Laravel Sanctum Bearer Tokens**.

## Audience

This document is intended for AI agents, automated integrations, and developers who want to interact with the TiTEC Automation API programmatically.

## Base URL

\`\`\`
${apiBaseUrl}/api
\`\`\`

## Public Endpoints (No Authentication Required)

The following endpoints are freely accessible and do **not** require a bearer token:

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | \`/products\` | List products (paginated) | 60/min |
| GET | \`/products/{id}\` | Get product details | 60/min |
| GET | \`/projects\` | List completed projects | 60/min |
| GET | \`/projects/{id}\` | Get project details | 60/min |
| GET | \`/brands\` | List product brands | 60/min |
| GET | \`/brands/{id}\` | Get brand details | 60/min |
| GET | \`/services\` | List service categories | 60/min |
| GET | \`/services/{slug}\` | Get service by slug | 60/min |
| POST | \`/contact\` | Submit contact form | 3/min |
| POST | \`/quotation-requests\` | Submit quotation request | 3/min |

## Authentication Flow

For protected endpoints (admin operations), authentication is required:

### 1. Register (optional)

\`\`\`http
POST ${apiBaseUrl}/api/register
Content-Type: application/json

{
  "name": "Agent Name",
  "email": "agent@example.com",
  "password": "secure-password",
  "password_confirmation": "secure-password",
  "role": "customer"
}
\`\`\`

> **Rate limit**: 3 requests per minute.

### 2. Login

\`\`\`http
POST ${apiBaseUrl}/api/login
Content-Type: application/json

{
  "email": "agent@example.com",
  "password": "secure-password"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Agent Name",
    "email": "agent@example.com",
    "role": "customer"
  }
}
\`\`\`

> **Rate limit**: 5 requests per minute.

### 3. Use the Token

Include the token in all subsequent requests:

\`\`\`http
GET ${apiBaseUrl}/api/user
Authorization: Bearer 1|abc123...
\`\`\`

### 4. Logout

\`\`\`http
POST ${apiBaseUrl}/api/logout
Authorization: Bearer 1|abc123...
\`\`\`

Revokes the current access token.

## Token Details

| Property | Value |
|----------|-------|
| **Type** | Laravel Sanctum Personal Access Token |
| **Format** | \`{id}\\|{plaintext}\` |
| **Lifetime** | 24 hours (1440 minutes) |
| **Transport** | \`Authorization: Bearer {token}\` header |
| **Scope** | Full access to user's permitted resources |

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| Public read endpoints | 60 requests/minute/IP |
| Public form submissions | 3 requests/minute/IP |
| Login | 5 requests/minute/IP |
| Registration | 3 requests/minute/IP |

## Error Responses

| Status | Description |
|--------|-------------|
| 401 | Invalid or expired token |
| 422 | Validation error (malformed request body) |
| 429 | Rate limit exceeded |

## Discovery

- **API Catalog**: [${baseUrl}/.well-known/api-catalog](${baseUrl}/.well-known/api-catalog)
- **OpenAPI Spec**: [${baseUrl}/.well-known/openapi.json](${baseUrl}/.well-known/openapi.json)
- **Website**: [${baseUrl}](${baseUrl})
`

    return new Response(markdown, {
        status: 200,
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    })
}
