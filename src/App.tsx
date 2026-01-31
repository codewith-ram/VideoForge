import { useState, useEffect, useRef } from 'react';
import { useFFmpeg } from './hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { FileUp, Play, Download, Terminal, Loader2, Video, Cpu, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { ffmpeg, loaded, load, message, progress } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // State for Intro Page
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [message]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setOutputUrl(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutputUrl(null);
    }
  };

  const convert = async () => {
    if (!file || !loaded) return;
    setIsConverting(true);
    setOutputUrl(null);

    const inputName = 'input.mov';
    const outputName = 'output.mp4';

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Default conversion command: -i input.mov output.mp4
      // You can add presets like -preset ultrafast if needed
      await ffmpeg.exec(['-i', inputName, outputName]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data as any], { type: 'video/mp4' }));

      setOutputUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 font-sans overflow-hidden relative selection:bg-apple-blue/30 text-label-primary">

      {/* GLOBAL BACKGROUND (Persists across views) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black animate-aurora pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-apple-blue/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-apple-purple/20 blur-[150px] rounded-full animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      {showIntro ? (
        /* ==================================================================================
           INTRO / LANDING PAGE VIEW (Editorial "Pro-Tool" Design)
           ================================================================================== */
        <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between min-h-[85vh] p-8 md:p-12 animate-fade-in gap-12">

          {/* Left Column: Typography & Context */}
          <div className="flex flex-col items-start gap-8 max-w-2xl">

            {/* Tech Badge */}
            <div className="flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md animate-slide-up">
              <div className="w-1.5 h-1.5 rounded-full bg-apple-green shadow-[0_0_8px_rgba(50,215,75,0.8)]"></div>
              <span className="text-xs font-mono text-label-secondary tracking-widest uppercase">System Operational</span>
              <div className="h-3 w-px bg-white/10"></div>
              <span className="text-xs font-mono text-label-tertiary">v2.4.0-wasm</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white leading-[0.95]">
                Studio-grade <br />
                <span className="text-label-tertiary">transcoding.</span>
              </h1>
              <p className="text-6xl md:text-8xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-apple-purple leading-[0.95]">
                Local execution.
              </p>
            </div>

            {/* Editorial Description */}
            <p className="text-xl text-label-secondary max-w-lg leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Leverage the raw power of FFmpeg directly in your browser.
              Massive performance gains with zero server latency.
              <span className="text-white font-normal block mt-2">Your files never leave your machine.</span>
            </p>

            {/* Primary CTA */}
            <div className="flex items-center gap-6 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => setShowIntro(false)}
                className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-slate-200 transition-colors"
              >
                <span>Initialize Engine</span>
                <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a href="#" className="text-sm font-medium text-label-secondary hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5">
                View Documentation
              </a>
            </div>

            {/* Tech Spec Strip */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/5 w-full animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-label-tertiary tracking-widest mb-1">Architecture</span>
                <span className="text-sm font-mono text-white">WASM / Threads</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-label-tertiary tracking-widest mb-1">Core</span>
                <span className="text-sm font-mono text-white">FFmpeg 5.1</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-label-tertiary tracking-widest mb-1">Latency</span>
                <span className="text-sm font-mono text-white">~0ms Network</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Abstract / "The Box" */}
          <div className="relative w-full max-w-md aspect-square md:aspect-[4/5] flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>

            {/* Back Layer - Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-apple-blue/20 to-apple-purple/20 rounded-3xl blur-3xl animate-pulse"></div>

            {/* The "Artifact" - Glass Stack */}
            <div className="relative w-full h-full material-regular rounded-3xl border border-white/10 p-2 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 ease-out shadow-2xl">
              <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden relative flex flex-col">

                {/* Fake Window Header */}
                <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-apple-red/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-apple-yellow/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-apple-green/80"></div>
                  </div>
                  <div className="text-[10px] font-mono text-white/30">bash — 80x24</div>
                </div>

                {/* Fake Terminal Content */}
                <div className="flex-1 p-4 font-mono text-xs text-apple-green/90 space-y-1 opacity-80 overflow-hidden">
                  <div><span className="text-apple-blue">➜</span> <span className="text-white">~</span> video-forge init</div>
                  <div className="text-label-tertiary">Loading WebAssembly modules...</div>
                  <div className="text-label-tertiary">Allocating generic memory buffer...</div>
                  <div className="flex gap-2 text-white/50">
                    <span>[================]</span>
                    <span>100%</span>
                  </div>
                  <div className="text-white">Done in 42ms.</div>
                  <br />
                  <div><span className="text-apple-blue">➜</span> <span className="text-white">~</span> ffmpeg -i input.mov output.mp4</div>
                  <div className="text-label-tertiary">Stream mapping:</div>
                  <div className="pl-4 border-l border-white/10 text-label-quaternary">
                    Stream #0:0 -{'>'} #0:0 (h264 (native) -{'>'} h264 (libx264))<br />
                    Stream #0:1 -{'>'} #0:1 (aac (native) -{'>'} aac (native))
                  </div>
                  <div className="animate-pulse mt-2 text-white">_</div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Floating Floating Elements */}
            <div className="absolute -right-8 -bottom-8 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl animate-[slide-up_4s_infinite_reverse]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-apple-blue/20 rounded-lg text-apple-blue">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-label-tertiary uppercase font-bold">Threads</div>
                  <div className="text-sm font-mono text-white">8 Cores</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ==================================================================================
           MAIN APPLICATION VIEW
           ================================================================================== */
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-10 animate-scale-in">

          {/* Header Section - App Mode */}
          <div className="text-center space-y-4 pt-8">
            <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setShowIntro(true)}>
              <ArrowRight className="w-3 h-3 rotate-180 text-label-secondary" />
              <span className="text-xs font-bold text-label-secondary tracking-widest uppercase">Back to Home</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">Video</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-apple-blue to-apple-purple">Forge</span>
            </h1>
          </div>

          {/* The "Hero" Card (App Interface) */}
          <div className="group relative material-thick rounded-[2.5rem] p-1 shadow-2xl overflow-hidden border border-white/10 mt-4 transition-all duration-500 hover:shadow-[0_0_50px_rgba(79,70,229,0.15)] animate-slide-up">

            {/* Glow border effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="p-8 md:p-14 flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-[2.3rem]">

              {/* Interactive Dropzone */}
              <div
                className={cn(
                  "w-full aspect-[21/9] rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden group/zone",
                  isDragOver
                    ? "border-apple-blue bg-apple-blue/10 scale-[1.02] shadow-[0_0_30px_rgba(10,132,255,0.2)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30",
                  file ? "border-transparent bg-black/80" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="video/*,audio/*"
                />

                {!file ? (
                  <label htmlFor="file-upload" className="flex flex-col items-center gap-6 cursor-pointer z-10 p-12 w-full h-full justify-center group-hover/zone:scale-105 transition-transform duration-300">
                    {/* Animated Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-apple-blue blur-2xl opacity-0 group-hover/zone:opacity-20 transition-opacity duration-500 rounded-full" />
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                        <FileUp className="w-10 h-10 text-label-secondary group-hover/zone:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-3xl font-semibold text-white tracking-tight">Drop video here</p>
                      <p className="text-base text-label-tertiary">MOV, MP4, MKV, AVI supported</p>
                    </div>

                    {/* Button fallback */}
                    <div className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
                      Browse Files
                    </div>
                  </label>
                ) : (
                  <div className="w-full h-full flex flex-row items-center justify-between p-12 animate-fade-in z-10 relative gap-8">
                    {/* File Info - Left */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white truncate">{file.name}</h3>
                        <div className="flex items-center gap-3 text-label-secondary">
                          <span className="text-sm font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-sm">Ready to convert</span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Action - Right */}
                    <button
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-apple-red transition-all border border-white/5 group"
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Bar */}
              <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">

                {/* Main Action Button */}
                <button
                  onClick={convert}
                  disabled={!file || !loaded || isConverting}
                  className={cn(
                    "relative w-full h-20 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group",
                    !file || !loaded || isConverting
                      ? "bg-white/5 text-label-tertiary cursor-not-allowed border border-white/5"
                      : "bg-white text-black hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] border border-transparent"
                  )}
                >
                  {/* Button Gradient Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none" />

                  {isConverting ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6" />
                      <span className="tracking-wide">Converting Video...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Start Conversion</span>
                      <div className="bg-black text-white p-1 rounded-full w-8 h-8 flex items-center justify-center ml-2 group-hover:translate-x-1 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </>
                  )}
                </button>

                {/* Secondary / Download Button */}
                {outputUrl ? (
                  <a
                    href={outputUrl}
                    download={`converted_${file?.name.split('.')[0] || 'video'}.mp4`}
                    className="w-full h-20 rounded-2xl bg-apple-green text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:bg-green-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Download className="w-6 h-6" />
                    <span>Save MP4</span>
                  </a>
                ) : (
                  <div className="flex flex-col justify-center items-center rounded-2xl bg-white/5 border border-white/5 h-20 text-label-tertiary opacity-50">
                    <span className="text-xs font-semibold uppercase tracking-wider">Output Ready</span>
                    <span className="text-sm text-label-quaternary">Waiting for process</span>
                  </div>
                )}
              </div>

              {/* Progress Bar - Big & Glowy */}
              {(isConverting || progress > 0) && (
                <div className="w-full mt-10 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-sm font-semibold text-white tracking-wide">Processing Video Frames</span>
                    <span className="text-3xl font-black text-white tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple relative overflow-hidden transition-all duration-300 ease-out shadow-[0_0_20px_rgba(94,92,230,0.5)]"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                      <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Integrated Terminal - HUD Style */}
            <div className="bg-black/80 border-t border-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-white/10">
                    <Terminal className="w-3 h-3 text-label-secondary" />
                  </div>
                  <span className="text-xs font-bold text-label-secondary uppercase tracking-widest">System Logs</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              <div
                ref={terminalRef}
                className="h-40 overflow-y-auto font-mono text-sm text-label-secondary/90 space-y-2 scrollbar-thin scrollbar-thumb-white/10 p-4 rounded-xl bg-black/50 border border-white/5 shadow-inner"
              >
                <div className="opacity-50 select-none pb-2 border-b border-white/5 mb-2">$ initializing environment_</div>
                <pre className="whitespace-pre-wrap font-mono leading-relaxed">{message}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
