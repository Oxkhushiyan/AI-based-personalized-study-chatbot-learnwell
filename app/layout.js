// app/layout.js
import './globals.css';

export const metadata = {
  title: 'LearnWell Chatbot',
  description: 'A personalized chatbot to support students in their educational journey.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-teal-50 min-h-screen">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}