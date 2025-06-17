
export const generateBookingReference = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.random().toString(36).substr(2, 3).toUpperCase(); // 3 random chars
  return `TG${timestamp}${random}`; // Format: TG123456ABC (11 characters total)
};
