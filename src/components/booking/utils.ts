
export const generateBookingReference = () => {
  const random = Math.random().toString(36).substr(2, 4).toUpperCase(); // 4 random chars
  return `TG${random}`; // Format: TGABCD (6 characters total)
};
