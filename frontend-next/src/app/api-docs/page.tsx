/**
 * /api-docs — API Documentation Page Route
 *
 * A simple redirect or placeholder for the human-readable API docs
 * referenced by the api-catalog's service-doc link.
 */
import { redirect } from 'next/navigation'

export default function ApiDocsPage() {
    // Redirect to the OpenAPI spec for now — can be replaced with
    // a Swagger UI page later if desired.
    redirect('/.well-known/openapi.json')
}
