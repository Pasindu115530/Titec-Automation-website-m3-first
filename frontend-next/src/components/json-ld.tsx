
import { contacts } from '@/assets/clients/Contacts';

export default function JsonLd() {
    const contact = contacts[0];

    // Organization Schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'TiTEC Automation',
        'url': process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk',
        'logo': `${process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk'}/loader-logo.png`, // Update if logo path is different
        'sameAs': [
            contact.facebook,
            contact.whatsapp,
        ].filter(Boolean),
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': contact.tel,
            'contactType': 'sales',
            'areaServed': 'LK',
            'availableLanguage': 'English'
        }
    };

    // LocalBusiness Schema
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness', // or EngineeringService, ProfessionalService
        'name': 'TiTEC Automation',
        'image': [
            `${process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk'}/og-image.jpg`
        ],
        '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk'}`,
        'url': process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk',
        'telephone': contact.tel,
        'email': contact.email,
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'No 123, Example Road', // Update with real address if user provides
            'addressLocality': 'Example City',
            'addressRegion': 'Western',
            'postalCode': '10000',
            'addressCountry': 'LK'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 6.9271, // Colombo default
            'longitude': 79.8612
        },
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            'opens': '08:30',
            'closes': '17:30'
        },
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
        </section>
    );
}
