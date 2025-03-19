
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container-width">
          <h1 className="h1 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p>Last updated: July 15, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Thys Gemaak Spitbraai Catering Services ("we," "our," or "us"). 
              We are committed to protecting your personal information and your right to privacy.
              This Privacy Policy explains how we collect, use, and share information about you when you use our 
              services, including our website and related services (collectively, the "Services").
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you fill out a form, make a booking, 
              send us an email, or otherwise communicate with us. This information may include:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Contact information (such as name, email address, phone number, and address)</li>
              <li>Event details (such as date, location, number of guests, and catering preferences)</li>
              <li>Payment information</li>
              <li>Any other information you choose to provide</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process and complete transactions, and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Personalize your experience with our Services</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing of Information</h2>
            <p>
              We may share the information we collect as follows:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
              <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of us or others</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We store the information we collect about you for as long as is necessary for the purpose(s) for which we 
              collected it or for other legitimate business purposes, including to meet our legal, regulatory, or other 
              compliance obligations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> info@thysgemaak.com<br />
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

export default PrivacyPolicy;
