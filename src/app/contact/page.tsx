'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      // Here you can add the API call to send the message
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });

      toast({
        title: 'Message Sent',
        description: 'We will respond to your message as soon as possible.',
      });

      // Reset form
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: 'Failed to Send',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Title Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          If you have any questions or suggestions, please feel free to contact us. Our customer service team is here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-10">Contact Information</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">Address</h3>
                <p className="text-gray-600">888 Nanjing East Road, Huangpu District, Shanghai</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">Phone</h3>
                <p className="text-gray-600">021-88888888</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">Email</h3>
                <p className="text-gray-600">contact@syjewelry.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">Business Hours</h3>
                <p className="text-gray-600">Monday - Sunday 10:00-22:00</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727010089485!2d121.47641661500703!3d31.236181981466352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b27040b1f53c33%3A0xb61a1c3b910b6e0b!2z5Y2X5Lqs5Lic6LevODg45Y-3!5e0!3m2!1szh-CN!2sus!4v1620120000000!5m2!1szh-CN!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-10">Leave a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                className="h-12"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="h-12"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter your phone number"
                className="h-12"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Enter your message"
                rows={6}
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-3 text-lg">How can I track my order?</h3>
            <p className="text-gray-600">
              After logging into your account, you can view the status and shipping information of all orders in "My Orders".
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-3 text-lg">Do you offer custom services?</h3>
            <p className="text-gray-600">
              Yes, we provide jewelry customization services. Please contact our customer service team for details.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-3 text-lg">How should I care for my jewelry?</h3>
            <p className="text-gray-600">
              We recommend regular cleaning with professional jewelry cleaner, avoiding contact with chemicals, and storing in a jewelry box.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-3 text-lg">What about after-sales service?</h3>
            <p className="text-gray-600">
              We provide lifetime maintenance for all products and accept returns within 7 days for quality issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 