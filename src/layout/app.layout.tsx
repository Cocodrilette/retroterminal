import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono flex flex-col md:flex-row p-2 md:p-4 gap-4 overflow-hidden relative">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center border border-green-700 p-3 z-50 bg-black">
        <h1 className="text-lg font-bold tracking-tighter">RETRO_CRM v1.0</h1>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="border border-green-500 px-2 py-1 text-xs hover:bg-green-500 hover:text-black transition-colors"
        >
          {isMenuOpen ? '[ CLOSE_X ]' : '[ MENU_# ]'}
        </button>
      </header>

      {/* Sidebar - Desktop: Visible, Mobile: Toggleable Overlay */}
      <aside 
        style={{ backgroundColor: '#000000' }}
        className={`
          fixed top-[85px] left-0 right-0 bottom-0 z-50 p-6 
          md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:p-4
          w-full md:w-64 border-t border-green-700 md:border-2 md:border-green-500 shrink-0 flex flex-col
          transition-all duration-300 md:translate-x-0
          ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible md:translate-x-0 md:opacity-100 md:visible'}
      `}>
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">RETRO_CRM v1.0</h1>
          <div className="text-xs opacity-50">SYSTEM STATUS: ONLINE</div>
        </div>
        
        {/* Mobile-only header in overlay */}
        <div className="md:hidden mb-6 border-b-2 border-green-500 pb-4">
          <h1 className="text-xl font-bold tracking-tighter mb-1">NAV_ROOT</h1>
          <div className="text-[10px] opacity-70">FILE_SYSTEM: MOUNTED</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Navigation />
        </div>
        
        {/* Close button inside overlay for mobile */}
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden mt-4 border border-green-500 p-3 text-xs font-bold hover:bg-green-500 hover:text-black transition-colors"
        >
          _EXIT_TERMINAL
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 border border-green-700 p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-transparent custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black backdrop-blur-md z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
} 
 