
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-accent/20">
      <Header />
      <main className="flex-1 py-4 md:py-6 px-4 md:px-6">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;