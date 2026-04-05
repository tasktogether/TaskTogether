import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Play, Trash2, Download, Camera } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'sonner';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob, fileName: string) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export function VideoRecorder({ onVideoRecorded, maxDuration = 120, className = '' }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [recordedUrl]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      toast.success('Camera ready! 📹');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedUrl(url);
      setIsPreviewing(true);
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100); // Collect data every 100ms
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success('Recording saved! 🎬');
    }
  };

  const deleteRecording = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setIsPreviewing(false);
    setRecordingTime(0);
    toast.info('Recording deleted');
  };

  const saveRecording = () => {
    if (recordedBlob) {
      const fileName = `intro-video-${Date.now()}.webm`;
      onVideoRecorded(recordedBlob, fileName);
      toast.success('Video saved! ✨');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Video Preview */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted={!isPreviewing}
          playsInline
          className="w-full h-full object-cover"
          src={isPreviewing ? recordedUrl || undefined : undefined}
        />
        
        {!hasPermission && !isPreviewing && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="text-center text-white p-6">
              <Camera size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-bold mb-2">Camera Not Active</p>
              <p className="text-sm opacity-75">Click "Start Camera" to begin</p>
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-full animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-bold text-sm">REC {formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Max Duration Warning */}
        {isRecording && recordingTime > maxDuration - 10 && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-2 rounded-full font-bold text-sm">
            {maxDuration - recordingTime}s left
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!hasPermission && !isPreviewing && (
          <Button onClick={startCamera} className="gap-2">
            <Video size={18} />
            Start Camera
          </Button>
        )}

        {hasPermission && !isRecording && !isPreviewing && (
          <Button onClick={startRecording} className="gap-2 bg-red-600 hover:bg-red-700">
            <Play size={18} />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button onClick={stopRecording} variant="outline" className="gap-2 border-red-600 text-red-600 hover:bg-red-50">
            <Square size={18} />
            Stop Recording
          </Button>
        )}

        {isPreviewing && (
          <>
            <Button onClick={saveRecording} className="gap-2 bg-green-600 hover:bg-green-700">
              <Download size={18} />
              Save & Use This Video
            </Button>
            <Button onClick={deleteRecording} variant="outline" className="gap-2 text-red-600 hover:bg-red-50">
              <Trash2 size={18} />
              Delete & Re-record
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-sm font-bold text-violet-900 mb-2">📹 Recording Tips:</p>
        <ul className="text-xs text-violet-700 space-y-1 list-disc list-inside">
          <li>Make sure you're in a well-lit area</li>
          <li>Introduce yourself and explain why you want to volunteer</li>
          <li>Keep it under {maxDuration / 60} minutes</li>
          <li>Speak clearly and smile! 😊</li>
        </ul>
      </div>
    </div>
  );
}
