import React from "react";
import Navbar from "../components/layout/Navbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
