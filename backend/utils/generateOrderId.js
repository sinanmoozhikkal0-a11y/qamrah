export const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;
  const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit random sequence
  return `QMR-${datePart}-${randomSuffix}`;
};
