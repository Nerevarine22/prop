import { CouponDirectory } from '@/components/product/CouponDirectory';
import { getPublishedFirmProfiles } from '@/lib/data/publicFirmRegistry';

export default async function CouponsPage() {
  const firms = await getPublishedFirmProfiles();
  const coupons = firms.flatMap((firm) => firm.verifiedCoupon ? [firm.verifiedCoupon] : []);

  return <CouponDirectory coupons={coupons} />;
}
