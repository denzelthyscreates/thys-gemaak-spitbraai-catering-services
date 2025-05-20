
import React from 'react';

const InfoBox: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm">
      <p className="font-medium text-amber-800">What happens next?</p>
      <ol className="list-decimal list-inside mt-2 ml-2 space-y-1 text-amber-700">
        <li>You'll be redirected to our booking form</li>
        <li>Complete the required contact and event details</li>
        <li>Submit your booking request</li>
        <li>We'll confirm your booking via email within 24-48 hours</li>
        <li>You'll receive payment instructions for securing your date</li>
      </ol>
    </div>
  );
};

export default InfoBox;
