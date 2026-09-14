import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MonitorPlay, Smartphone, Square, Download, Upload, Shield, Lock, LogOut, CheckCircle2 } from 'lucide-react';

export default function VideoScale() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [format, setFormat] = useState('9:16');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/login');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setIsDone(false);
      setProgress(0);
    }
  };

  const processVideo = () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate Local WebAssembly Processing (for MVP UI)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsDone(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const downloadVideo = () => {
    if (!videoFile) return;
    const url = URL.createObjectURL(videoFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_converted_${format.replace(':', 'x')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-500/10 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Video className="text-purple-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus VideoScale</h1>
              <p className="text-gray-400 text-sm">Local-First Bulk Video Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-purple-400 text-sm bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
              <Lock size={14} />
              <span>WebAssembly Engine (Local)</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Upload className="text-purple-400" />
              1. Drop Raw Video
            </h2>
            <p className="text-gray-400 text-sm mb-6">File stays in your browser. No cloud uploads.</p>
            
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-500/5 transition-all relative overflow-hidden">
              {videoFile ? (
                <div className="text-center z-10">
                  <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-300 font-bold">{videoFile.name}</p>
                  <p className="text-gray-500 text-sm">Ready for processing</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                  <MonitorPlay className="w-12 h-12 text-gray-500 mb-4" />
                  <p className="text-lg text-gray-400">Click to upload MP4</p>
                </div>
              )}
              <input type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
            </label>
          </div>

          {/* Settings Section */}
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-cyan/5 rounded-full blur-3xl group-hover:bg-nexus-cyan/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Shield className="text-nexus-cyan" />
              2. Output Settings
            </h2>
            <p className="text-gray-400 text-sm mb-6">Select the format for the final video.</p>
            
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setFormat('9:16')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${format === '9:16' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                <Smartphone size={24} />
                <span className="font-bold">9:16</span>
                <span className="text-xs opacity-70">TikTok/Reels</span>
              </button>
              <button onClick={() => setFormat('1:1')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${format === '1:1' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                <Square size={24} />
                <span className="font-bold">1:1</span>
                <span className="text-xs opacity-70">Instagram Post</span>
              </button>
              <button onClick={() => setFormat('16:9')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${format === '16:9' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                <MonitorPlay size={24} />
                <span className="font-bold">16:9</span>
                <span className="text-xs opacity-70">YouTube</span>
              </button>
            </div>
          </div>
        </div>

        {/* Processing Bar & Action Button */}
        <div className="flex flex-col items-center mb-12 w-full max-w-2xl mx-auto">
          {isProcessing && (
            <div className="w-full mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Processing locally via WebAssembly...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-nexus-cyan to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {!isDone ? (
            <button 
              onClick={processVideo}
              disabled={isProcessing || !videoFile}
              className="bg-gradient-to-r from-purple-500 to-nexus-cyan text-black font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 w-full justify-center"
            >
              {isProcessing ? 'Rendering Video...' : 'Render Locally'}
            </button>
          ) : (
            <button 
              onClick={downloadVideo}
              className="w-full bg-white text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download />
              Download Converted Video
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
