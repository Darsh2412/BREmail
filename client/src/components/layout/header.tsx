import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="ri-mail-send-line text-primary text-2xl"></i>
          <h1 className="text-xl font-semibold text-gray-700">Email Sender</h1>
        </div>
        <nav>
          <Button variant="outline" size="sm">
            <i className="ri-question-line mr-1"></i> Help
          </Button>
        </nav>
      </div>
    </header>
  );
}
