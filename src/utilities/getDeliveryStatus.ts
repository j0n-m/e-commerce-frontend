export default function getDeliveryStatus(
  orderPlacedDate: Date,
  shippingCode: number
) {
  const currentDate = new Date();
  const getShippingDateFromCode = (
    orderPlacedDate: Date,
    shippingCode: number
  ) => {
    /*
    Standard
    5 - 7 day delivery
    (Free)

    Express
    3 - 5 day delivery
    (+$5.99)

    Next Day Air
    1 day delivery
    (+$15.99)
    */
    switch (shippingCode) {
      case 1:
        return new Date(orderPlacedDate.valueOf() + 864e5 * 6);
      case 2:
        return new Date(orderPlacedDate.valueOf() + 864e5 * 4);
      case 3:
        return new Date(orderPlacedDate.valueOf() + 864e5 * 1);
      default:
        return undefined;
    }
  };

  const deliveryDate = getShippingDateFromCode(orderPlacedDate, shippingCode);
  if (!deliveryDate) return false;
  const status =
    currentDate < deliveryDate
      ? { statusText: "Order is on the way", status: false, deliveryDate }
      : {
          statusText: `Delivered on ${deliveryDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`,
          status: true,
          deliveryDate,
        };
  return status;
}
