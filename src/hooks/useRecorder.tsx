import { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  console.log(navigator.language);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    setError("Browser does not support microphone access");
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Browser does not support microphone access");
      return;
    }
    setRecordedUrl("");
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: navigator.language,
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/mp3" });
        setRecordedUrl(URL.createObjectURL(recordedBlob));
        chunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();

    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach((t) => t.stop());
    setIsRecording((prev) => !prev);
  };

  return {
    isRecording,
    recordedUrl,
    startRecording,
    stopRecording,
    mediaStream,
    chunks,
    transcript,
    setIsRecording,
    error,
    listening,
  };
};
