"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusSquare,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleNavigation = (path) => {
    router.push(path);
    closeSidebar(); // Close sidebar on mobile after navigating
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 focus:outline-none"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div className="relative lg:static">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <div
          className={`fixed top-0 left-0 h-180 bg-gray-900 text-white w-64 z-50 shadow-lg transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block`}
        >
          {/* Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button onClick={closeSidebar} className="text-white">
              <X size={28} />
            </button>
          </div>

          <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <h1 className="text-3xl font-extrabold text-green-400 tracking-wide">
              The Daily Fit
            </h1>
          </div>

          <nav className="flex flex-col mt-10 space-y-4 px-4">
            <SidebarItem
              icon={<PlusSquare size={22} />}
              text="Create Product Post"
              onClick={() => handleNavigation("/Createpost")}
            />
            <SidebarItem
              icon={<FileText size={22} />}
              text="View Featured Product"
              onClick={() => handleNavigation("/Featuredpost")}
            />
            <SidebarItem
              icon={<FileText size={22} />}
              text="View Mens Product"
              onClick={() => handleNavigation("/Menspost")}
            />
            <SidebarItem
              icon={<FileText size={22} />}
              text="View kids Product"
              onClick={() => handleNavigation("/Kidspost")}
            />
            <SidebarItem
              icon={<FileText size={22} />}
              text="View Ladies Product"
              onClick={() => handleNavigation("/Ladiespost")}
            />
            <SidebarItem
              icon={<FileText size={22} />}
              text="View acceserioes"
              onClick={() => handleNavigation("/Acceserioes")}
            />
            <SidebarItem
              icon={<LogOut size={22} />}
              text="Logout"
              onClick={() => handleNavigation("/")}
            />
          </nav>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 rounded-md text-gray-200 hover:bg-gray-800 hover:text-white transition-colors w-full text-left"
    >
      {icon}
      <span className="text-lg font-medium">{text}</span>
    </button>
  );
}
