import Carousel from '@/components/home/Carousel';
import ProductGrid from '@/components/home/ProductGrid';
import CompanySection from '@/components/home/CompanySection';

export default function Home() {
  return (
    <main>
      <Carousel />
      
      <section className="container mx-auto px-4 py-16">
        <ProductGrid />
      </section>

      <CompanySection />
    </main>
  );
}
