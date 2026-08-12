import type { Metadata } from 'next';
import { ProductLab } from './ProductLab';

export const metadata: Metadata = {
  title: 'Product direction lab',
  description: 'Private product direction prototype for PropHub.',
  robots: { index: false, follow: false },
};

export default function ProductLabPage() {
  return <ProductLab />;
}
