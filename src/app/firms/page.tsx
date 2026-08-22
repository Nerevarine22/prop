import { redirect } from 'next/navigation';

type LegacyDirectoryProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DirectoryRedirectPage({ searchParams }: LegacyDirectoryProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value) query.set(key, value);
  });

  const suffix = query.size ? `?${query.toString()}` : '';
  redirect(`/prop-firms${suffix}`);
}
