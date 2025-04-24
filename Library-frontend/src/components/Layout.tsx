import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col  ">
      <Navbar />
      <main className="flex-grow mt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
