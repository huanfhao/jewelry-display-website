'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm'
import { Suspense } from 'react'

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-[80vh] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-playfair mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium mb-1">Address</h3>
                      <p className="text-gray-600">Guangzhou, China</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium mb-1">WhatsApp</h3>
                      <p className="text-gray-600">+86 153 9578 7004</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-gray-600">SYJewelryDisplay@outlook.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium mb-1">Business Hours</h3>
                      <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM (GMT+8)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-playfair mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Suspense>
  );
} 