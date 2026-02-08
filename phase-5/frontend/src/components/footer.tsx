export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Momentum. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
