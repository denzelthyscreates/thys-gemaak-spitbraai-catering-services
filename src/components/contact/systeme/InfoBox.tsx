
import React from 'react';

const InfoBox: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm">
      <p className="font-medium text-amber-800">What happens next?</p>
      <ol className="list-decimal list-inside mt-2 ml-2 space-y-1 text-amber-700">
        <li>We'll review your booking details</li>
        <li>You'll receive a confirmation email within 24-48 hours</li>
        <li>We'll provide payment instructions to secure your booking</li>
        <li>A final consultation will be scheduled closer to your event date</li>
      </ol>
    </div>
  );
};

export default InfoBox;
