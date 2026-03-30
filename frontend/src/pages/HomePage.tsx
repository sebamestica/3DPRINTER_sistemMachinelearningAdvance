import { HeroSection } from '../sections/HeroSection';
import { DesignWorkbenchSection } from '../sections/DesignWorkbenchSection';
import { GeometryGallerySection } from '../sections/GeometryGallerySection';
import { ComparisonSection } from '../sections/ComparisonSection';
import { MethodologySection } from '../sections/MethodologySection';
import { Footer } from '../sections/Footer';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased overflow-x-hidden">
      
      {/* 1. HERO - Scientific Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      {/* 2. DESIGN WORKBENCH - Core Cubes 5x5x5 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "circOut" }}
      >
        <DesignWorkbenchSection />
      </motion.div>

      {/* 3. GEOMETRY LIBRARY - Pattern Exploration */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <GeometryGallerySection />
      </motion.div>

      {/* 4. COMPARISON - Analytical Choice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ComparisonSection />
      </motion.div>

      {/* 5. ACADEMIC METHODOLOGY */}
      <MethodologySection />

      {/* 6. CONTEXT FOOTER */}
      <Footer />

      {/* Cyber Decorator */}
      <div className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent w-full opacity-30 pointer-events-none z-50" />
    </div>
  );
}
