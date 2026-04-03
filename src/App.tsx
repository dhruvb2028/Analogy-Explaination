import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Lightbulb, 
  Layers, 
  Map, 
  BookOpen, 
  AlertTriangle, 
  RefreshCw,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { generateAnalogy } from './services/geminiService';
import { AnalogyRequest, AnalogyResponse, AudienceLevel } from './types';

export default function App() {
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState<AudienceLevel>('Beginner');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalogyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateAnalogy({ concept, audienceLevel: level, domain });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate analogy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const levels: AudienceLevel[] = ['Kid', 'Beginner', 'Intermediate', 'Expert'];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Analogy Master</span>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Complex Ideas → Intuitive Understanding
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Explain Anything with <span className="text-indigo-600">Analogies</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Enter a complex concept and we'll transform it into a relatable story tailored to your audience.
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Concept to Explain</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g. Quantum Entanglement, Blockchain, Photosynthesis"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Audience Level</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AudienceLevel)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Domain (Optional)</label>
                <input 
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Sports, Cooking"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              disabled={loading || !concept}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate Analogy
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-6 text-slate-500 font-medium animate-pulse">Decomposing concept and mapping domains...</p>
            </motion.div>
          ) : result ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Concept Header */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Lightbulb className="w-32 h-32 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.concept}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                  <BookOpen className="w-4 h-4" />
                  {level} Level
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Decomposition */}
                <div className="lg:col-span-1 space-y-6">
                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      Decomposition
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Components</h4>
                        <ul className="space-y-1">
                          {result.decomposition.components.map((c, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Processes</h4>
                        <ul className="space-y-1">
                          {result.decomposition.processes.map((p, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Limitations
                    </h3>
                    <ul className="space-y-3">
                      {result.limitations.map((l, i) => (
                        <li key={i} className="text-sm text-amber-900/80 leading-relaxed">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Main Analogy */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800">
                        <Map className="w-6 h-6 text-indigo-500" />
                        The {result.mainAnalogy.domain} Analogy
                      </h3>
                    </div>
                    
                    <div className="prose prose-slate max-w-none mb-8">
                      <p className="text-lg text-slate-700 leading-relaxed italic">
                        "{result.mainAnalogy.story}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mapping the Concept</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.mainAnalogy.mapping.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-sm font-bold text-indigo-600 shrink-0">{m.from}</div>
                            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                            <div className="text-sm text-slate-600">{m.to}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Deep Explanation</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </section>

                  {/* Alternatives */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {result.alternatives.map((alt, i) => (
                      <section key={i} className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          {alt.domain}
                        </h4>
                        <p className="text-sm text-indigo-800/70 leading-relaxed">
                          {alt.explanation}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Ready to simplify?</h3>
              <p className="text-slate-400">Enter a concept above to get started.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Powered by Gemini AI • Designed for Clarity
          </p>
        </div>
      </footer>
    </div>
  );
}
