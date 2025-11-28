import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ResultCard from './components/ResultCard';
import { analyzeContent } from './services/geminiService';
import { ContentType, AnalysisResult } from './types';
import { Upload, X, Loader2, FileVideo, Image as ImageIcon, Sparkles, Mic } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetAnalysis = () => {
    setResult(null);
    setTextInput('');
    setMediaPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit check (e.g. 10MB to avoid browser crash on base64, adjust as needed)
    if (file.size > 10 * 1024 * 1024) {
      setError("حجم الملف كبير جداً. يرجى استخدام ملف أصغر من 10 ميجابايت للتجربة.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
      setResult(null); // Clear previous result
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const executeAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let type: ContentType;
      let data: string;
      let mimeType: string | undefined;

      if (activeTab === 'text') {
        if (!textInput.trim()) {
            setError("يرجى إدخال نص للتحليل");
            setIsLoading(false);
            return;
        }
        type = ContentType.TEXT;
        data = textInput;
      } else {
        if (!mediaPreview) {
             setError("يرجى اختيار ملف");
             setIsLoading(false);
             return;
        }
        // Extract base64 and mime type
        const matches = mediaPreview.match(/^data:(.*);base64,(.*)$/);
        if (!matches || matches.length !== 3) {
           throw new Error("Invalid file format");
        }
        mimeType = matches[1];
        data = matches[2];
        
        if (activeTab === 'image') type = ContentType.IMAGE;
        else if (activeTab === 'video') type = ContentType.VIDEO;
        else type = ContentType.AUDIO;
      }

      const analysis = await analyzeContent(type, data, mimeType);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "فشل التحليل");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <Dashboard />;

    const isText = activeTab === 'text';
    const isImage = activeTab === 'image';
    const isVideo = activeTab === 'video';
    const isAudio = activeTab === 'audio';

    const title = isText 
        ? 'فحص النصوص' 
        : isImage 
            ? 'فحص الصور' 
            : isVideo 
                ? 'فحص الفيديو' 
                : 'فحص الصوت';
                
    const desc = isText 
      ? 'قم بلصق النص المشتبه به هنا لتحليله لغوياً ودلالياً.' 
      : isImage 
        ? 'ارفع الصورة لفحص البيكسلات والتشوهات البصرية.' 
        : isVideo
            ? 'ارفع مقطع فيديو قصير لتحليل الحركة والاتساق الزمني.'
            : 'ارفع الملف الصوتي لتحليل نبرة الصوت، التنفس، والبحث عن آثار التوليد الآلي.';

    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                {title}
                {isLoading && <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />}
            </h1>
            <p className="text-slate-400">{desc}</p>
        </header>

        {!result ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-10 shadow-xl transition-all hover:border-emerald-500/30">
            {isText ? (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="أدخل النص هنا للتحليل..."
                className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-light leading-relaxed text-lg"
              />
            ) : (
              <div 
                className={`border-2 border-dashed border-slate-600 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${mediaPreview ? 'bg-slate-900' : 'hover:bg-slate-700/30 hover:border-emerald-500/50'}`}
                onClick={() => !mediaPreview && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept={isImage ? "image/*" : isVideo ? "video/*" : "audio/*"} 
                  onChange={handleFileUpload}
                />
                
                {mediaPreview ? (
                  <div className="relative w-full h-full flex items-center justify-center group p-4">
                    {isImage ? (
                      <img src={mediaPreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                    ) : isVideo ? (
                      <video src={mediaPreview} controls className="max-h-full max-w-full rounded-lg" />
                    ) : (
                      <audio src={mediaPreview} controls className="w-full max-w-lg" />
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); resetAnalysis(); }}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-slate-700/50 rounded-full mb-4">
                      {isImage ? (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      ) : isVideo ? (
                        <FileVideo className="w-8 h-8 text-slate-300" />
                      ) : (
                        <Mic className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <p className="text-slate-300 font-medium">
                        اضغط لرفع ملف {isImage ? 'صورة' : isVideo ? 'فيديو' : 'صوت'}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">أو اسحب الملف هنا</p>
                  </>
                )}
              </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button
              onClick={executeAnalysis}
              disabled={isLoading || (isText ? !textInput : !mediaPreview)}
              className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحليل المعمق...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  بدء الفحص الجنائي
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
               <button 
                 onClick={resetAnalysis} 
                 className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
               >
                 فحص جديد
               </button>
            </div>
            <ResultCard result={result} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { resetAnalysis(); setActiveTab(tab); }} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;