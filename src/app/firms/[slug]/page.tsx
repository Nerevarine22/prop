import { permanentRedirect } from 'next/navigation';

export default async function LegacyFirmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/prop-firms/${slug}`);
}
