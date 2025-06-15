
export const generateBookingReference = () => {
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  const random = Math.random().toString(36).substr(2, 3).toUpperCase(); // 3 random chars
  return `TGS${timestamp}${random}`; // Format: TGS1234ABC
};
