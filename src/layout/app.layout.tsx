import Navigation from "../components/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col md:flex-row p-2 md:p-4 gap-4">
      <aside className="w-full md:w-64 border border-green-700 p-4 shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">RETRO_CRM v1.0</h1>
          <div className="text-xs opacity-50">SYSTEM STATUS: ONLINE</div>
        </div>
        <Navigation />
      </aside>
      <main className="flex-1 border border-green-700 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
} 
 