import TopNav from '@/components/landing/TopNav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Segments from '@/components/landing/Segments';
import Privacy from '@/components/landing/Privacy';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <Hero />
      <HowItWorks />
      <Segments />
      <Privacy />
      <Footer />
    </main>
  );
}
