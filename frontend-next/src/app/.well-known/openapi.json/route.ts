/**
 * /.well-known/openapi.json — OpenAPI 3.1.0 Specification
 *
 * Machine-readable description of the TiTEC public API.
 * Referenced by the RFC 9727 api-catalog via service-desc.
 */
export function GET() {
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk'

    const spec = {
        openapi: '3.1.0',
        info: {
            title: 'TiTEC Automation Public API',
            description:
                'Public REST API for TiTEC Automation — industrial automation solutions provider in Sri Lanka. Provides access to products, projects, brands, services, and quotation requests.',
            version: '1.0.0',
            contact: {
                name: 'TiTEC Automation',
                url: 'https://titecautomation.lk',
                email: 'info@titecautomation.lk',
            },
        },
        servers: [
            {
                url: `${apiBaseUrl}/api`,
                description: 'Production API',
            },
        ],
        paths: {
            '/products': {
                get: {
                    summary: 'List products',
                    description:
                        'Returns a paginated list of products available in the store.',
                    operationId: 'listProducts',
                    parameters: [
                        {
                            name: 'search',
                            in: 'query',
                            description: 'Filter by name or description',
                            schema: { type: 'string' },
                        },
                        {
                            name: 'page',
                            in: 'query',
                            description: 'Page number',
                            schema: { type: 'integer', default: 1 },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Paginated list of products',
                        },
                    },
                },
            },
            '/products/{id}': {
                get: {
                    summary: 'Get product details',
                    operationId: 'getProduct',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                        },
                    ],
                    responses: {
                        '200': { description: 'Product details' },
                        '404': { description: 'Product not found' },
                    },
                },
            },
            '/projects': {
                get: {
                    summary: 'List projects',
                    operationId: 'listProjects',
                    responses: {
                        '200': { description: 'List of completed projects' },
                    },
                },
            },
            '/projects/{id}': {
                get: {
                    summary: 'Get project details',
                    operationId: 'getProject',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                        },
                    ],
                    responses: {
                        '200': { description: 'Project details' },
                        '404': { description: 'Project not found' },
                    },
                },
            },
            '/brands': {
                get: {
                    summary: 'List brands',
                    operationId: 'listBrands',
                    responses: {
                        '200': { description: 'List of product brands' },
                    },
                },
            },
            '/services': {
                get: {
                    summary: 'List service categories',
                    operationId: 'listServices',
                    responses: {
                        '200': {
                            description: 'List of service categories with items',
                        },
                    },
                },
            },
            '/contact': {
                post: {
                    summary: 'Submit contact form',
                    operationId: 'submitContact',
                    description: 'Rate limited to 3 requests per minute per IP.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'message'],
                                    properties: {
                                        name: { type: 'string' },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                        },
                                        phone: { type: 'string' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': { description: 'Message sent successfully' },
                        '422': { description: 'Validation error' },
                        '429': { description: 'Rate limit exceeded' },
                    },
                },
            },
            '/quotation-requests': {
                post: {
                    summary: 'Submit quotation request',
                    operationId: 'submitQuotationRequest',
                    description:
                        'Submit a request for quotation with selected products. Rate limited to 3 requests per minute per IP.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'items'],
                                    properties: {
                                        name: { type: 'string' },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                        },
                                        phone: { type: 'string' },
                                        message: { type: 'string' },
                                        items: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    product_id: {
                                                        type: 'integer',
                                                    },
                                                    quantity: {
                                                        type: 'integer',
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Quotation request submitted',
                        },
                        '422': { description: 'Validation error' },
                        '429': { description: 'Rate limit exceeded' },
                    },
                },
            },
        },
    }

    return new Response(JSON.stringify(spec, null, 2), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'Access-Control-Allow-Origin': '*',
        },
    })
}
