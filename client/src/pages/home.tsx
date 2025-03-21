import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import EmailForm from "@/components/email-form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <EmailForm />
      </main>
      <Footer />
    </div>
  );
}
