/**
 * Markdown Content Negotiation — Page Content Provider
 *
 * Returns markdown content for each public page when agents
 * request Accept: text/markdown.
 *
 * This module is used by the Next.js middleware to serve markdown
 * versions of pages without requiring the full React render pipeline.
 */

const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'
const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk'

/**
 * Static markdown content keyed by pathname.
 * For dynamic pages (e.g. /store/[slug]), a function-based
 * lookup can be added later.
 */
const STATIC_PAGES: Record<string, string> = {
    '/': `# TiTEC Automation | Industrial Automation Solutions in Sri Lanka

TiTEC Automation is a leading provider of industrial automation solutions in Sri Lanka.

## Services

- **Complete Automation Systems** — Fully integrated automation systems designed for reliability, efficiency, and long-term performance.
- **Machine Fabrication** — Custom-made machine fabrication tailored to your operational needs.
- **Machine Installations** — Complete installation and commissioning of industrial machines.
- **PLC Programming** — Custom PLC solutions for precise machine control.
- **HMI & SCADA Design** — Interactive, real-time monitoring and control interfaces.
- **Electrical Panel Design** — Custom control panel design and manufacturing.
- **Renewable Energy Solutions** — Solar and sustainable energy integration.
- **Home Automation** — Smart home systems and IoT integration.
- **24/7 Emergency Support** — Round-the-clock technical support and maintenance.

## Quick Links

- [Product Store](${BASE_URL}/store)
- [Our Projects](${BASE_URL}/projects)
- [Services](${BASE_URL}/services)
- [About Us](${BASE_URL}/about)
- [Contact](${BASE_URL}/contact)
- [FAQ](${BASE_URL}/faq)

## API Access

- [API Catalog](${BASE_URL}/.well-known/api-catalog)
- [OpenAPI Spec](${BASE_URL}/.well-known/openapi.json)
- [Auth Documentation](${BASE_URL}/auth.md)

## Contact

- **Website**: [titecautomation.lk](${BASE_URL})
- **Location**: Sri Lanka
`,

    '/about': `# About TiTEC Automation

TiTEC Automation is an industrial automation engineering company based in Sri Lanka, specializing in designing and deploying tailored automation systems from concept to commissioning.

## What We Do

We deliver high-precision industrial automation solutions that help Sri Lankan manufacturers operate smarter, faster, and with greater reliability. From PLCs to robotics and machinery integration, we combine global-grade engineering with local expertise to reduce downtime, boost efficiency, and keep your business ahead of the technology curve.

## Our Expertise

- PLC Programming & Integration
- SCADA System Design & Implementation
- Industrial Robot Integration
- Custom Machine Fabrication
- Electrical Panel Design & Manufacturing
- Renewable Energy Solutions
- Home & Building Automation
- 24/7 Emergency Technical Support

## Contact

Visit our [contact page](${BASE_URL}/contact) to get in touch.
`,

    '/store': `# TiTEC Automation — Product Store

Browse our catalog of industrial automation products, components, and equipment.

## Browse Products

Visit [${BASE_URL}/store](${BASE_URL}/store) to explore our full product range.

## API Access

Products are available programmatically via our REST API:

\`\`\`
GET ${API_URL}/api/products
GET ${API_URL}/api/products/{id}
\`\`\`

See our [OpenAPI Spec](${BASE_URL}/.well-known/openapi.json) for full documentation.

## Request a Quote

Submit a quotation request for any product through our [quotation system](${BASE_URL}/store) or via the API:

\`\`\`
POST ${API_URL}/api/quotation-requests
\`\`\`
`,

    '/services': `# TiTEC Automation — Services

We offer a comprehensive range of industrial automation and engineering services.

## Industrial Automation Solutions

- Complete Automation Systems
- Machine Fabrication
- Machine Installations
- PLC Programming
- HMI & SCADA Designing and Programming
- Variable Frequency Drive (VFD) Installations
- Sensor & Instrumentation Integration
- Retrofitting & Upgrades

## Electrical Panel Design & Manufacturing

- Custom Control Panel Design
- MCC & PCC Panel Manufacturing
- Panel Wiring & Assembly
- Testing & Commissioning

## Renewable Energy Solutions

- Solar Panel Installation
- Energy Management Systems
- Power Factor Correction
- Sustainable Energy Consulting

## Home Automation

- Smart Home Systems
- IoT Device Integration
- Lighting & Climate Control
- Security System Automation

## 24/7 Emergency Support

- Round-the-Clock Technical Support
- Preventive Maintenance Programs
- Remote Diagnostics & Troubleshooting
- On-Site Emergency Response
`,

    '/projects': `# TiTEC Automation — Projects Portfolio

View our completed industrial automation projects showcasing our engineering expertise across Sri Lanka.

## Browse Projects

Visit [${BASE_URL}/projects](${BASE_URL}/projects) to explore our project gallery with detailed case studies.

## API Access

Project data is available via our API:

\`\`\`
GET ${API_URL}/api/projects
GET ${API_URL}/api/projects/{id}
\`\`\`
`,

    '/contact': `# Contact TiTEC Automation

Get in touch with us for industrial automation solutions, quotations, or technical support.

## Contact Form

Visit [${BASE_URL}/contact](${BASE_URL}/contact) to submit an inquiry.

## API

Submit a contact form programmatically:

\`\`\`
POST ${API_URL}/api/contact
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your@email.com",
  "phone": "+94...",
  "message": "Your inquiry..."
}
\`\`\`

Rate limit: 3 requests per minute per IP.
`,

    '/faq': `# TiTEC Automation — Frequently Asked Questions

## General

### What is TiTEC Automation?
TiTEC Automation is an industrial automation engineering company based in Sri Lanka, specializing in PLC programming, SCADA systems, electrical panel design, and complete automation solutions.

### Where is TiTEC Automation located?
We are based in Sri Lanka and serve manufacturing and industrial clients across the country.

### What industries do you serve?
We serve manufacturing, food & beverage, textile, pharmaceutical, and other industrial sectors requiring automation solutions.

## Services

### Do you offer custom automation solutions?
Yes, we design and deploy tailored automation systems from concept to commissioning, customized to your specific operational needs.

### Do you provide 24/7 support?
Yes, we offer round-the-clock emergency technical support and preventive maintenance programs.

### Can you help with renewable energy?
Yes, we provide solar panel installation, energy management systems, and sustainable energy consulting.
`,

    '/clients': `# TiTEC Automation — Our Clients

We serve a diverse range of industrial clients across Sri Lanka, delivering automation solutions that improve efficiency and reliability.

Visit [${BASE_URL}/clients](${BASE_URL}/clients) to see our client portfolio.
`,
}

/**
 * Look up markdown content for a given pathname.
 * Returns null if no markdown representation is available.
 */
export function getMarkdownForPath(pathname: string): string | null {
    // Exact match first
    if (STATIC_PAGES[pathname]) {
        return STATIC_PAGES[pathname]
    }

    // Strip trailing slash and try again
    const normalised = pathname.replace(/\/$/, '') || '/'
    if (STATIC_PAGES[normalised]) {
        return STATIC_PAGES[normalised]
    }

    return null
}

/**
 * Rough token count estimation (words ÷ 0.75).
 * Good enough for the x-markdown-tokens header.
 */
export function estimateTokens(text: string): number {
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.ceil(words / 0.75)
}
