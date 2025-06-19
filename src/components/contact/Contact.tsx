
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactHeader from './ContactHeader';
import BookingFlowContainer from '../booking/BookingFlowContainer';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

const Contact = () => {
  const contactSectionRef = useRef<HTMLElement>(null);

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="booking">Event Booking</TabsTrigger>
            <TabsTrigger value="inquiry">General Inquiry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="booking" className="px-1">
            <BookingFlowContainer />
          </TabsContent>
          
          <TabsContent value="inquiry" className="px-1">
            <ContactForm />
          </TabsContent>
        </Tabs>
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
