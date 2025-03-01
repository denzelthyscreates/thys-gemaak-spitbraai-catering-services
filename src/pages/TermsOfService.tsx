
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container-width">
          <h1 className="h1 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p>Last updated: July 15, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services provided by Thys Gemaak Spitbraai Catering Services ("we," "our," or "us"), 
              including our website and catering services (collectively, the "Services"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Catering Services</h2>
            <p>
              Our catering services are subject to availability and confirmation. We reserve the right to refuse service 
              to anyone for any reason at any time.
            </p>
            <p className="mt-4">
              When you book our catering services, you agree to provide accurate, current, and complete information. You are 
              responsible for ensuring that the venue for your event is accessible and suitable for our catering equipment and staff.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Booking and Cancellation</h2>
            <p>
              A deposit is required to confirm your booking. The deposit amount and payment schedule will be outlined in your 
              catering contract. Deposits are non-refundable but may be transferable to another date, subject to availability.
            </p>
            <p className="mt-4">
              Cancellation policies:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Cancellations made 30 days or more before the event date: 50% of the total amount will be refunded (excluding the deposit)</li>
              <li>Cancellations made 14-29 days before the event date: 25% of the total amount will be refunded (excluding the deposit)</li>
              <li>Cancellations made less than 14 days before the event date: No refund will be provided</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Menu and Dietary Requirements</h2>
            <p>
              We can accommodate certain dietary requirements with advance notice. It is your responsibility to inform us of any 
              allergies or dietary restrictions at least 14 days before your event.
            </p>
            <p className="mt-4">
              We reserve the right to make substitutions to the menu in case of ingredient availability issues. We will make 
              reasonable efforts to notify you of any significant changes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
              use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Your use or inability to use our Services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from our Services</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Services</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> wade@thysgemaak.com<br />
              <strong>Phone:</strong> +27 60 461 3766<br />
              <strong>Address:</strong> 75 School Street, Kylemore, Stellenbosch, 7600
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
