import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UploadSection from "@/components/UploadSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <section id="upload" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Get Your Application Reviewed
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Upload your Erasmus+ application and receive a detailed AI
            evaluation report via email.
          </p>
          <UploadSection />
        </div>
      </section>
      <Footer />
    </main>
  );
}
