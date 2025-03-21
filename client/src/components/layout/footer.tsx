export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-2 md:mb-0">© 2023 Email Sender App</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
