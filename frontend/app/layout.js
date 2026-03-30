import "./globals.css";

export const metadata = {
  title: "Salon Prestige",
  description: "Online rezervacija termina",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bs" style={{ background: '#111110' }}>
      <body style={{ background: '#111110', minHeight: '100vh', color: '#e8e6e0' }}>
        {children}
      </body>
    </html>
  );
}