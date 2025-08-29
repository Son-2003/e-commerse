export function formatPrice(price: number): string {
  const actualPrice = price * 1000;
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(actualPrice);
}
