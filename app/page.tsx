import CallToAction from '@/components/landing/CallToAction/CallToAction';
import Features from '@/components/landing/Features/Features';
import Footer from '@/components/landing/Footer/Footer';
import Header from '@/components/landing/Header/Header';
import Hero from '@/components/landing/Hero/Hero';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
