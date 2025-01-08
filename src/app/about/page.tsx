import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Title Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-6">About SY Jewelry</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We are dedicated to providing you with the highest quality jewelry design and craftsmanship. 
          Each piece embodies our artistry and creativity.
        </p>
      </div>

      {/* Brand Story */}
      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div className="relative aspect-[4/3]">
          <Image
            src="/images/company.jpg"
            alt="Brand Story"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-gray-600 text-lg">
            <p>
              Founded in 2020, SY Jewelry was born from the dreams of young designers passionate about jewelry.
              We believe each piece of jewelry should tell a unique story and convey special emotions.
            </p>
            <p>
              Over the years, we have built a professional design and production team,
              perfectly blending traditional craftsmanship with modern design to create unique pieces for our clients.
            </p>
          </div>
        </div>
      </div>

      {/* Our Advantages */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-16">Our Advantages</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Original Design</h3>
            <p className="text-gray-600">
              Each piece is originally designed by our team, ensuring uniqueness and artistic value.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
            <p className="text-gray-600">
              We select premium materials and maintain strict quality control throughout production.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Dedicated Service</h3>
            <p className="text-gray-600">
              Professional jewelry consultation and after-sales service to ensure your satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-16">Our Journey</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="flex gap-12">
              <div className="w-32 flex-shrink-0 text-primary font-bold text-lg">2020</div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Brand Launch</h3>
                <p className="text-gray-600">SY Jewelry was established, beginning our journey in original jewelry design.</p>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="w-32 flex-shrink-0 text-primary font-bold text-lg">2021</div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Team Expansion</h3>
                <p className="text-gray-600">Welcomed experienced designers and craftsmen to expand our team.</p>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="w-32 flex-shrink-0 text-primary font-bold text-lg">2022</div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Online Platform</h3>
                <p className="text-gray-600">Launched our online store to provide a convenient shopping experience.</p>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="w-32 flex-shrink-0 text-primary font-bold text-lg">2023</div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Brand Upgrade</h3>
                <p className="text-gray-600">Complete brand refresh with multiple new original jewelry collections.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us */}
      <div className="text-center bg-gray-50 p-16 rounded-2xl">
        <h2 className="text-3xl font-bold mb-8">Join Our Team</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
          We are always looking for passionate and creative talents to join our team.
          If you are passionate about jewelry design, we welcome you to the SY Jewelry family.
        </p>
        <a
          href="mailto:careers@syjewelry.com"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Submit Resume
        </a>
      </div>
    </div>
  );
} 