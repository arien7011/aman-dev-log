import { Metadata } from 'next';
import { ContactPageClient } from './page-client';
import { generateSEOMetadata } from '@/lib/utils';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact',
  description: 'Get in touch with Aman Mishra for collaboration, freelance projects, or just to say hello.',
  keywords: ['contact', 'hire', 'freelance', 'collaboration', 'frontend developer'],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
