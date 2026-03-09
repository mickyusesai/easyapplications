import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyItMatters from "@/components/WhyItMatters";
import NotChatGPT from "@/components/NotChatGPT";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <WhyItMatters />
      <NotChatGPT />
      <Features />
      <Footer />
    </main>
  );
}
