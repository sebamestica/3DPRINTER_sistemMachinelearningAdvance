import type { ReactNode } from 'react';

/**
 * Technical Workspace Shell (CAD / Slicer Paradigm)
 * Header + Sidebar-Left + Viewport-Center + Sidebar-Right + Bottom-Dock
 */

interface WorkspaceShellProps {
  header: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  bottomDock?: ReactNode;
  children: ReactNode;
}

export function WorkspaceShell({ header, leftPanel, rightPanel, bottomDock, children }: WorkspaceShellProps) {
  return (
    <div className="h-screen w-screen bg-[#020202] text-zinc-300 font-sans flex flex-col overflow-hidden antialiased select-none">
      
      {/* GLOBAL HEADER (LOCKED) */}
      <header className="h-16 shrink-0 z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-3xl px-8 flex items-center justify-between">
        {header}
      </header>

      <div className="flex-1 flex overflow-hidden">
         
         {/* DESIGN / PARAMETER PALETTE (LEFT) */}
         <aside className="w-[480px] shrink-0 h-full border-r border-white/5 bg-[#050505] overflow-y-auto custom-scrollbar shadow-2xl relative z-40">
            {leftPanel}
         </aside>

         {/* VIEWPORT ENGINE (CENTER) */}
         <main className="flex-1 relative bg-black shadow-inner overflow-hidden">
            {children}
            
            {/* HUD / WIDGETS OVERLAYS */}
            {bottomDock && (
               <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none px-20">
                  <div className="pointer-events-auto bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full h-16 shadow-3xl px-12 max-w-4xl w-full flex items-center justify-between">
                    {bottomDock}
                  </div>
               </div>
            )}
         </main>

         {/* ANALYSIS / ANALYTICS (RIGHT) */}
         <aside className="w-[450px] shrink-0 h-full border-l border-white/5 bg-[#050505] overflow-y-auto custom-scrollbar shadow-[-20px_0_50px_rgba(0,0,0,0.5)] relative z-40">
            {rightPanel}
         </aside>

      </div>
    </div>
  );
}
