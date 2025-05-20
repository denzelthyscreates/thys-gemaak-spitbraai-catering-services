import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CookiePolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container-width">
          <h1 className="h1 mb-8">Cookie Policy</h1>
          
          <div className="prose max-w-none">
            <p>Last updated: July 15, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              This Cookie Policy explains how Thys Gemaak Spitbraai Catering Services ("we," "our," or "us") uses cookies 
              and similar technologies to recognize you when you visit our website. It explains what these technologies are 
              and why we use them, as well as your rights to control our use of them.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. What are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
              as well as to provide reporting information.
            </p>
            <p className="mt-4">
              Cookies set by the website owner (in this case, Thys Gemaak Spitbraai Catering Services) are called "first-party cookies." 
              Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable 
              third-party features or functionality to be provided on or through the website (e.g., advertising, interactive 
              content, and analytics). The parties that set these third-party cookies can recognize your computer both when it 
              visits the website in question and also when it visits certain other websites.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Why Do We Use Cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons 
              in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other 
              cookies also enable us to track and target the interests of our users to enhance the experience on our website. 
              Third parties serve cookies through our website for advertising, analytics, and other purposes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Types of Cookies We Use</h2>
            <p>The specific types of first and third-party cookies served through our website and the purposes they perform include:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
              <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</li>
              <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
              <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Our Cookie Banner and Your Choices</h2>
            <p>
              When you first visit our website, you will see a cookie banner that allows you to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Accept all cookies</li>
              <li>Accept only necessary cookies</li>
              <li>Select specific categories of cookies to accept</li>
            </ul>
            <p className="mt-4">
              In compliance with South African data protection laws (POPIA), non-essential cookies (analytics and marketing) 
              are disabled by default and require your explicit opt-in consent before they are activated.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Minimality</h2>
            <p>
              We affirm that we only collect the minimum amount of data necessary through cookies to fulfill the stated 
              purposes. This approach is in alignment with the data minimality principle under POPIA.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Compliance</h2>
            <p>
              All third-party cookie providers used on our website are required to comply with South African Protection of 
              Personal Information Act (POPIA) or equivalent data protection laws. We regularly review our third-party 
              relationships to ensure ongoing compliance.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. How Can You Control Cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by 
              clicking on the appropriate opt-out links provided in the cookie banner on our website.
            </p>
            <p className="mt-4">
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
              you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> spitbookings@thysgemaak.com<br />
              <strong>Phone:</strong> +27 67 456 7784<br />
              <strong>Address:</strong> 75 School Street, Kylemore, Stellenbosch, 7600
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
