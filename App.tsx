
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, BookOpen, Search, Info, X, CheckCircle2, 
  AlertTriangle, Loader2, RefreshCw, ExternalLink, 
  ChevronRight, Bug, MapPin, ShieldAlert, Zap
} from 'lucide-react';
import { analyzePestImage, getPestDetailsByName } from './geminiService';
import { RecognitionResult, PestInfo } from './types';

// --- UI Components ---

const Header: React.FC = () => (
  <header className="bg-[#1a472a] text-white p-5 shadow-lg sticky top-0 z-50 rounded-b-3xl">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
          <Bug className="w-6 h-6 text-green-300" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">PestScan Pro</h1>
          <p className="text-[10px] text-green-300 font-bold uppercase tracking-widest">Inteligência Urbana</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30 text-green-300">MODO ESPECIALISTA</span>
      </div>
    </div>
  </header>
);

const PestCard: React.FC<{ pest: PestInfo; sources?: { uri: string; title: string }[] }> = ({ pest, sources }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="bg-gradient-to-br from-green-50 to-white p-6 border-b border-gray-50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-black rounded-full uppercase mb-2 inline-block">
            {pest.category}
          </span>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">{pest.name}</h2>
          <p className="text-sm italic text-green-700 font-semibold">{pest.scientificName}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-2xl border border-red-100 group">
          <ShieldAlert className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
    
    <div className="p-6 space-y-8">
      <section>
        <h3 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
          <Info className="w-4 h-4 text-green-600" /> Identificação Visual
        </h3>
        <div className="flex flex-wrap gap-2">
          {pest.characteristics.map((c, i) => (
            <span key={i} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm border border-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> {c}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" /> Anatomia
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {pest.anatomy}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" /> Hábitos e Bio
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {pest.habits}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="bg-red-50/50 p-5 rounded-3xl border border-red-100">
          <h3 className="flex items-center gap-2 text-xs font-black text-red-800 uppercase tracking-widest mb-3">
            <AlertTriangle className="w-4 h-4" /> Riscos à Saúde e Impacto
          </h3>
          <p className="text-sm text-red-700 font-medium leading-relaxed">{pest.healthRisks}</p>
        </section>

        <section className="bg-green-600 p-6 rounded-3xl shadow-lg shadow-green-900/10">
          <h3 className="text-xs font-black text-green-100 uppercase tracking-widest mb-4">Estratégias de Controle Profissional</h3>
          <div className="space-y-3">
            {pest.controlMethods.map((m, i) => (
              <div key={i} className="flex gap-4 items-start bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <span className="bg-white text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                <p className="text-sm text-white font-medium">{m}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {sources && sources.length > 0 && (
        <section className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <ExternalLink className="w-4 h-4" /> Referências e Fotos Reais
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {sources.map((src, i) => (
              <a 
                key={i} 
                href={src.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors border border-gray-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Search className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors line-clamp-1">{src.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

const CameraScanner: React.FC<{ onScan: (result: RecognitionResult) => void }> = ({ onScan }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      // Tenta primeiro a câmera traseira
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      // Fallback para qualquer câmera disponível
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        setIsCameraActive(true);
      } catch (fallbackErr) {
        alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
    }
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, stream]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    setIsLoading(true);
    try {
      const result = await analyzePestImage(base64Image);
      onScan(result);
    } catch (err) {
      alert("Falha na análise. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {!isCameraActive ? (
        <div className="w-full px-4">
           <button 
            onClick={startCamera}
            className="w-full bg-[#1a472a] hover:bg-green-900 text-white font-black py-8 px-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 transition-all active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent"></div>
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-md">
              <Camera className="w-10 h-10 text-green-300" />
            </div>
            <div className="text-center relative z-10">
              <span className="text-xl uppercase block">Scanner Inteligente</span>
              <span className="text-[10px] text-green-400 font-bold opacity-80">TOQUE PARA ABRIR A CÂMERA</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-[4/5] bg-black rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-[#1a472a]">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover" 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-72 h-72 border-2 border-white/30 rounded-[2rem] relative backdrop-blur-[1px]">
                <div className="absolute -top-2 -left-2 w-12 h-12 border-t-8 border-l-8 border-green-500 rounded-tl-2xl"></div>
                <div className="absolute -top-2 -right-2 w-12 h-12 border-t-8 border-r-8 border-green-500 rounded-tr-2xl"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-8 border-l-8 border-green-500 rounded-bl-2xl"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-8 border-r-8 border-green-500 rounded-br-2xl"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500/30 animate-pulse"></div>
             </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 px-10 flex justify-between items-center">
            <button 
              onClick={() => {
                if (stream) stream.getTracks().forEach(t => t.stop());
                setIsCameraActive(false);
              }} 
              className="bg-white/10 backdrop-blur-xl p-5 rounded-full text-white border border-white/20"
            >
              <X />
            </button>
            <button 
              onClick={captureAndAnalyze}
              disabled={isLoading}
              className="bg-white p-6 rounded-full shadow-2xl hover:scale-105 active:scale-90 transition-all border-[6px] border-green-500/20"
            >
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <div className="w-4 h-4 bg-white rounded-full"></div>}
              </div>
            </button>
            <div className="w-16"></div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-[#0a1a0f]/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white p-10 text-center">
          <div className="relative mb-8">
            <Loader2 className="w-24 h-24 text-green-500 animate-spin" />
            <Bug className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-300" />
          </div>
          <h2 className="text-3xl font-black mb-4">Analisando Praga...</h2>
          <p className="text-green-300/60 max-w-xs font-medium">Cruzando dados de biologia urbana e controle sanitário.</p>
        </div>
      )}
    </div>
  );
};

const LibrarySection: React.FC<{ onSelect: (name: string) => void }> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const commonPests = [
    { name: 'Aranha Marrom', icon: '🕷️', cat: 'Aracnídeo' },
    { name: 'Pombo Comum', icon: '🐦', cat: 'Ave Urbana' },
    { name: 'Barata Germânica', icon: '🪳', cat: 'Inseto' },
    { name: 'Escorpião Amarelo', icon: '🦂', cat: 'Aracnídeo' },
    { name: 'Rato de Telhado', icon: '🐀', cat: 'Roedor' },
    { name: 'Formiga Carpinteira', icon: '🐜', cat: 'Inseto' },
    { name: 'Cupim de Madeira', icon: '🪵', cat: 'Isóptero' },
    { name: 'Aranha de Jardim', icon: '🕷️', cat: 'Aracnídeo' },
    { name: 'Mosca Doméstica', icon: '🪽', cat: 'Díptero' },
    { name: 'Carrapato Estrela', icon: '🕷️', cat: 'Ácaro' },
  ];

  const filtered = commonPests.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar no Guia de Pragas..."
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map(pest => (
          <button 
            key={pest.name}
            onClick={() => onSelect(pest.name)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-green-200 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                {pest.icon}
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-lg leading-tight">{pest.name}</h4>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">{pest.cat}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600" />
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'guide' | 'result'>('camera');
  const [lastResult, setLastResult] = useState<RecognitionResult | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleScan = useCallback((result: RecognitionResult) => {
    setLastResult(result);
    setActiveTab('result');
  }, []);

  const handleLibrarySelect = async (name: string) => {
    setIsLoadingDetails(true);
    try {
      const result = await getPestDetailsByName(name);
      setLastResult(result);
      setActiveTab('result');
    } catch (err) {
      alert("Erro ao carregar detalhes.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-[#f8faf8] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 p-5 overflow-y-auto">
        {activeTab === 'camera' && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">Mapeamento de Pragas</h2>
              <p className="text-gray-500 text-sm mt-2 font-medium">Incluindo agora pombos e aranhas na base de dados.</p>
            </div>
            <CameraScanner onScan={handleScan} />
            
            <div className="mt-12 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/5 flex gap-5">
               <div className="bg-red-50 p-3 rounded-2xl shrink-0">
                 <ShieldAlert className="w-6 h-6 text-red-600" />
               </div>
               <div>
                  <h4 className="font-black text-gray-900 text-sm">Alerta de Saúde</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">Algumas aranhas e aves podem transmitir doenças graves. Mantenha distância e use o zoom para fotografar.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'result' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Resultado da Análise</h2>
              <button 
                onClick={() => { setLastResult(null); setActiveTab('camera'); }}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> NOVO SCAN
              </button>
            </div>

            {lastResult ? (
              lastResult.pestFound ? (
                <PestCard pest={lastResult.pest!} sources={lastResult.sources} />
              ) : (
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-gray-100 mt-10">
                  <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">Não Identificado</h3>
                  <p className="text-gray-500 text-sm mt-4 font-medium leading-relaxed">Não foi possível detectar a praga. Tente uma foto com melhor foco.</p>
                </div>
              )
            ) : (
              <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Aguardando dados...</div>
            )}
          </div>
        )}

        {activeTab === 'guide' && <LibrarySection onSelect={handleLibrarySelect} />}
      </main>

      {isLoadingDetails && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="mt-4 font-black text-gray-900">BUSCANDO DOSSIÊ TÉCNICO...</p>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center max-w-lg mx-auto z-50 px-4 h-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
        <button 
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-20 ${activeTab === 'guide' ? 'text-green-700 scale-110' : 'text-gray-400'}`}
        >
          <BookOpen className={`w-6 h-6 ${activeTab === 'guide' ? 'fill-green-100' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Guia</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('camera')}
          className="relative -top-6 bg-[#1a472a] p-5 rounded-full shadow-2xl shadow-green-900/40 border-8 border-[#f8faf8] transition-transform active:scale-90"
        >
          <Camera className="w-7 h-7 text-white" />
        </button>

        <button 
          onClick={() => setActiveTab('result')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-20 ${activeTab === 'result' ? 'text-green-700 scale-110' : 'text-gray-400'}`}
        >
          <Search className={`w-6 h-6 ${activeTab === 'result' ? 'fill-green-100' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Análise</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
