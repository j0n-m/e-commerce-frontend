export default function getShippingMethod(shippingCode: number) {
  switch (shippingCode) {
    case 1:
      return "Free Standard Shipping";
    case 2:
      return "Express Shipping";
    case 3:
      return "Next Day Air";
    default:
      return "Unknown";
  }
}
