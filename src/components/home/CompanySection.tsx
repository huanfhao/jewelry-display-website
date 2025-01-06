import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CompanySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/company.jpg"
              alt="SY Jewelry Studio"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About SY Jewelry</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2018, SY Jewelry is a brand dedicated to designing and crafting high-quality jewelry.
              Our design team is committed to perfectly blending traditional craftsmanship with modern aesthetics,
              creating unique jewelry pieces for you.
            </p>
            <div className="grid grid-cols-3 gap-6 py-6">
              <div>
                <h3 className="text-2xl font-bold text-primary">3+ Years</h3>
                <p className="text-gray-600">Brand History</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">1000+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">100+</h3>
                <p className="text-gray-600">Original Designs</p>
              </div>
            </div>
            <Link href="/about">
              <Button size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 