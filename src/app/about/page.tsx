import Image from 'next/image';
import teamImage from '../../../public/images/team.jpg';

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-playfair mb-6 md:mb-8 text-center">
            About Us
          </h1>
          
          <div className="relative aspect-[4/3] md:aspect-video mb-6 md:mb-8">
            <Image
              src={teamImage}
              alt="Our Team"
              fill
              className="object-cover object-center rounded-lg"
              sizes="(max-width: 768px) 100vw, 768px"
              quality={90}
            />
          </div>

          <div className="prose prose-sm md:prose-lg mx-auto px-4 md:px-0">
            <p>
              Founded in 2018, SY Jewelry Display specializes in creating premium display 
              props and accessories for jewelry presentation. Our team combines expertise in 
              design, materials, and aesthetics to enhance the display of your precious pieces.
            </p>
            
            <h2 className="!mt-8 !mb-4">Our Philosophy</h2>
            <p>
              We believe that exceptional jewelry deserves exceptional presentation tools. From 
              custom display props to innovative accessory designs, we help you create 
              attractive presentations that highlight your jewelry's beauty.
            </p>

            <h2 className="!mt-8 !mb-4">Quality & Innovation</h2>
            <p>
              Using premium materials and refined craftsmanship, we ensure each display prop 
              meets the highest standards of quality and practicality. Our designs focus on 
              both aesthetics and functionality, creating the perfect complement to showcase 
              your jewelry collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 