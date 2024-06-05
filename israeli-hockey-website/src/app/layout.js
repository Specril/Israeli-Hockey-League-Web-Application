import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GoalNet: Israeli Roller Hockey Portal",
  description: "The official website of the Israeli Roller Hockey League",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
