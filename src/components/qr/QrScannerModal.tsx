import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { 
  QrCode, 
  Camera, 
  FlipHorizontal, 
  Zap, 
  ZapOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  PlayCircle, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { playQrScanSound, playClickSound } from '../../services/audioNotifier';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string, autoStart?: boolean) => void;
}

// Preset mapping for auto-enrichment of scanned service codes
const KNOWN_SERVICES: Record<string, { displayName: string; icon: string; category: string; cost: string }> = {
  whatsapp: { displayName: 'WhatsApp', icon: '💬', category: 'Chat', cost: '$0.60' },
  telegram: { displayName: 'Telegram', icon: '✈️', category: 'Chat', cost: '$0.50' },
  google: { displayName: 'Google', icon: '🔍', category: 'Tech', cost: '$0.50' },
  openai: { displayName: 'OpenAI', icon: '🤖', category: 'AI', cost: '$0.75' },
  chatgpt: { displayName: 'OpenAI', icon: '🤖', category: 'AI', cost: '$0.75' },
  discord: { displayName: 'Discord', icon: '🎮', category: 'Community', cost: '$0.40' },
  twitter: { displayName: 'Twitter', icon: '🐦', category: 'Social', cost: '$0.45' },
  x: { displayName: 'Twitter', icon: '🐦', category: 'Social', cost: '$0.45' },
  instagram: { displayName: 'Instagram', icon: '📸', category: 'Social', cost: '$0.50' },
  tiktok: { displayName: 'TikTok', icon: '🎵', category: 'Video', cost: '$0.55' },
  steam: { displayName: 'Steam', icon: '🕹️', category: 'Gaming', cost: '$0.40' },
  uber: { displayName: 'Uber', icon: '🚗', category: 'Transport', cost: '$0.50' },
  binance: { displayName: 'Binance', icon: '🪙', category: 'Crypto', cost: '$0.80' },
  microsoft: { displayName: 'Microsoft', icon: '💻', category: 'Tech', cost: '$0.45' },
  netflix: { displayName: 'Netflix', icon: '🍿', category: 'Streaming', cost: '$0.65' },
  roblox: { displayName: 'Roblox', icon: '🧱', category: 'Gaming', cost: '$0.45' },
  cashapp: { displayName: 'Cash App', icon: '💵', category: 'Finance', cost: '$0.70' },
  paypal: { displayName: 'PayPal', icon: '💳', category: 'Finance', cost: '$0.60' },
  amazon: { displayName: 'Amazon', icon: '📦', category: 'Shopping', cost: '$0.55' },
  apple: { displayName: 'Apple', icon: '🍏', category: 'Tech', cost: '$0.60' }
};

// Parses QR code strings into clean TextVerified service names
export function parseServiceQrCode(rawText: string): { serviceName: string; raw: string; matchedMeta?: typeof KNOWN_SERVICES[string] } {
  const cleanRaw = rawText.trim();
  let candidate = cleanRaw;

  // 1. JSON parsing attempt: e.g. {"service": "Telegram"} or {"code": "whatsapp"}
  if (candidate.startsWith('{') && candidate.endsWith('}')) {
    try {
      const parsed = JSON.parse(candidate);
      candidate = parsed.service || parsed.serviceName || parsed.name || parsed.code || parsed.target || candidate;
    } catch {
      // ignore
    }
  }

  // 2. URL parsing attempt: e.g. textverified://verify?service=Google or https://.../?target=binance
  if (candidate.includes('://') || candidate.startsWith('http') || candidate.startsWith('textverified:')) {
    try {
      const url = new URL(candidate);
      const queryService = url.searchParams.get('service') || 
                           url.searchParams.get('serviceName') || 
                           url.searchParams.get('name') || 
                           url.searchParams.get('target') || 
                           url.searchParams.get('code');
      if (queryService) {
        candidate = queryService;
      } else {
        // Look at pathname: /service/telegram -> telegram
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          candidate = segments[segments.length - 1];
        }
      }
    } catch {
      // not a valid standard URL, continue
    }
  }

  // 3. Prefix matching: e.g. "SERVICE:TELEGRAM", "TV:WHATSAPP", "CODE=OPENAI"
  const prefixMatch = candidate.match(/^(?:service|tv|target|textverified|code|id)[:=](.+)$/i);
  if (prefixMatch && prefixMatch[1]) {
    candidate = prefixMatch[1];
  }

  // Clean candidate: remove extra quotes, symbols, or trailing whitespace
  candidate = candidate.replace(/["'{}[\]]/g, '').trim();

  // Look for known service match
  const lookupKey = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchedMeta = KNOWN_SERVICES[lookupKey];

  const finalName = matchedMeta ? matchedMeta.displayName : (candidate || 'Unknown Service');

  return {
    serviceName: finalName,
    raw: cleanRaw,
    matchedMeta
  };
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  
  // Scanned result
  const [scannedResult, setScannedResult] = useState<{
    serviceName: string;
    raw: string;
    matchedMeta?: typeof KNOWN_SERVICES[string];
  } | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setTorchOn(false);
    setTorchAvailable(false);
  }, []);

  // Handle successful QR detection
  const handleDetectedCode = useCallback((code: string) => {
    const parsed = parseServiceQrCode(code);
    playQrScanSound();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // ignore
      }
    }
    setScannedResult(parsed);
  }, []);

  // Start video stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScannedResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported on this browser or platform.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as { torch?: boolean }) : {};
        if (capabilities && capabilities.torch) {
          setTorchAvailable(true);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Camera access issue:', err);
      if (errorMsg.includes('Permission') || errorMsg.includes('denied') || errorMsg.includes('NotAllowedError')) {
        setCameraError(t.cameraPermissionDenied || 'Camera permission was denied. Please allow camera access in browser settings.');
      } else if (errorMsg.includes('NotFoundError') || errorMsg.includes('DevicesNotFoundError')) {
        setCameraError('No video camera detected on your device.');
      } else {
        setCameraError(`Camera initialisation notice: ${errorMsg}`);
      }
    }
  }, [facingMode, stopCamera, t.cameraPermissionDenied]);

  // Frame processing loop for QR decoding
  useEffect(() => {
    if (!isScanning || !isOpen || activeTab !== 'camera' || scannedResult) {
      return;
    }

    let lastScanTime = 0;
    const scanInterval = 120; // ms between scans for battery/cpu efficiency

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const now = performance.now();
      if (now - lastScanTime >= scanInterval) {
        lastScanTime = now;
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);

            // Attempt jsQR decode
            const qrCode = jsQR(imageData.data, width, height, {
              inversionAttempts: 'attemptBoth',
            });

            if (qrCode && qrCode.data) {
              handleDetectedCode(qrCode.data);
              return; // Stop animation loop once code is detected
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isScanning, isOpen, activeTab, scannedResult, handleDetectedCode]);

  // Lifecycle when modal opens/closes or changes tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scannedResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, scannedResult, startCamera, stopCamera]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextTorch = !torchOn;
      // @ts-expect-error torch is valid in advanced constraints
      await track.applyConstraints({ advanced: [{ torch: nextTorch }] });
      setTorchOn(nextTorch);
      playClickSound();
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Switch Camera facing mode
  const switchFacingMode = () => {
    playClickSound();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Scan from uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (code && code.data) {
          handleDetectedCode(code.data);
        } else {
          alert('No QR code detected in the selected image. Please try another clearer image.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.scanQrCode}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300">
                  Camera Lens
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {t.scanQrSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('camera');
              setScannedResult(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('samples');
              stopCamera();
            }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'samples'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample QR Codes</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* TAB 1: Live Camera Scanner */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Scanned Card Overlay if already scanned */}
              {scannedResult ? (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                      {t.serviceDetected}
                    </span>
                    <h4 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                      {scannedResult.matchedMeta?.icon && <span>{scannedResult.matchedMeta.icon}</span>}
                      <span>{scannedResult.serviceName}</span>
                    </h4>
                    {scannedResult.matchedMeta && (
                      <div className="mt-1 flex items-center justify-center gap-3 text-xs text-slate-300">
                        <span>Category: <strong>{scannedResult.matchedMeta.category}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-bold">Cost: {scannedResult.matchedMeta.cost}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-[11px] text-slate-400 break-all max-h-20 overflow-y-auto">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Scanned Payload:</span>
                    {scannedResult.raw}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectService(scannedResult.serviceName, false);
                        onClose();
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t.applyService}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectService(scannedResult.serviceName, true);
                        onClose();
                      }}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4 text-emerald-200" />
                      <span>{t.applyAndStart}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      setScannedResult(null);
                      startCamera();
                    }}
                    className="text-xs text-slate-400 hover:text-white underline pt-1 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Scan Another QR Code</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Camera Viewport */}
                  <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                    {/* Hidden canvas for jsQR analysis */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera Video Stream */}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />

                    {/* Scanner HUD Overlay */}
                    {!cameraError && isScanning && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Target reticle box */}
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.55)]">
                          {/* Corner brackets */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                          {/* Animated laser scan line */}
                          <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
                        </div>

                        {/* Instruction pill */}
                        <div className="absolute bottom-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] font-medium text-emerald-300 backdrop-blur-sm shadow-md">
                          Point camera at any TextVerified service QR code
                        </div>
                      </div>
                    )}

                    {/* Error display if camera denied or unavailable */}
                    {cameraError && (
                      <div className="p-6 text-center max-w-sm space-y-3 z-10">
                        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-rose-300 leading-relaxed">
                          {cameraError}
                        </p>
                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={startCamera}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retry Camera</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('upload')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Or Upload QR Image File</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls Toolbar */}
                  <div className="flex items-center justify-between gap-2 px-1">
                    <button
                      onClick={switchFacingMode}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
                    >
                      <FlipHorizontal className="w-4 h-4 text-emerald-400" />
                      <span>{t.switchCamera}</span>
                    </button>

                    {torchAvailable && (
                      <button
                        onClick={toggleTorch}
                        className={`px-3.5 py-2 rounded-xl border text-xs transition flex items-center gap-2 cursor-pointer ${
                          torchOn
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {torchOn ? <ZapOff className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                        <span>{t.toggleTorch}</span>
                      </button>
                    )}

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer ml-auto"
                    >
                      <Upload className="w-4 h-4 text-teal-400" />
                      <span>From Photo</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: Image File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-950/40 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Select or Drop QR Code Image
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Upload any screenshot, photo, or saved PNG/JPEG barcode image containing TextVerified service data.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  Browse Files
                </button>
              </div>

              {scannedResult && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{scannedResult.matchedMeta?.icon || '⚡'}</span>
                    <div>
                      <p className="text-xs text-emerald-400 font-bold">Successfully Decoded:</p>
                      <p className="text-sm font-black text-white">{scannedResult.serviceName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectService(scannedResult.serviceName, false);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Instant Sample QR Codes (Click-to-test & QR badges) */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-emerald-400 mb-0.5">Quick Desktop Testing:</p>
                <p className="text-slate-400 text-[11px]">
                  Click any sample card below to simulate an instantaneous camera QR scan, or point your physical phone at these QR codes!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'WhatsApp', code: 'textverified://service?name=WhatsApp&code=whatsapp', icon: '💬', cost: '$0.60' },
                  { name: 'Telegram', code: 'textverified://service?name=Telegram&code=telegram', icon: '✈️', cost: '$0.50' },
                  { name: 'OpenAI', code: '{"service":"OpenAI","code":"openai"}', icon: '🤖', cost: '$0.75' },
                  { name: 'Google', code: 'TV:GOOGLE:AUTH', icon: '🔍', cost: '$0.50' },
                  { name: 'Binance', code: 'SERVICE=BINANCE', icon: '🪙', cost: '$0.80' },
                  { name: 'Discord', code: 'textverified://verify?service=Discord', icon: '🎮', cost: '$0.40' },
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      handleDetectedCode(sample.code);
                      setActiveTab('camera');
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/70 text-left transition hover:bg-slate-800/40 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{sample.icon}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{sample.cost}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{sample.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{sample.code}</p>
                    </div>
                    <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <span>Simulate Scan</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Camera & jsQR Decoder Ready</span>
          </span>
          <button
            onClick={() => {
              playClickSound();
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
