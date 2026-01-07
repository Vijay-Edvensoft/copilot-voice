import { useRef, useState, type Dispatch, type SetStateAction } from "react";
export type Props = {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  recordedUrl: string;
  setRecordedUrl: Dispatch<SetStateAction<string>>;
};

const Recorder = () => {
  // const { isRecording, setIsRecording, recordedUrl, setRecordedUrl } = props;

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  // const [seconds, setSeconds] = useState(0);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      // const timer = setInterval(() => {
      //   setSeconds((prev) => prev + 1);
      // }, 1000);
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        console.log(recordedUrl);
        console.log(recordedUrl);
        chunks.current = [];
        // clearTimeout(timer);
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.log(error);
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
    // setSeconds(0);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream?.current?.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  // const formatTimer = (ts: number): string => {
  //   const hours = Math.floor(ts / 3600);
  //   const min = Math.floor((ts % 3600) / 60);
  //   const sec = Math.floor(ts % 60);
  //   return `${String(hours).padStart(2, "0")}:${String(min).padStart(
  //     2,
  //     "0"
  //   )}:${String(sec).padStart(2, "0")}`;
  // };

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isRecording) {
      startRecording();
    }
  };

  return (
    <button
      className="absolute right-14 bottom-3 text-gray-400 text-xl hover:text-white p-2 rounded-lg hover:bg-gray-600 transition duration-200 "
      onClick={handleRecording}
    >
      <i className="fa-solid fa-microphone "></i>
    </button>
  );

  // <div>
  {
    /* <h2 className="text-[60px] text-amber-800">{formatTimer(seconds)}</h2> */
  }

  // <button
  //   className="absolute right-14 bottom-3 text-gray-400 text-xl hover:text-white p-2 rounded-lg hover:bg-gray-600 transition duration-200 "
  //   onClick={handleRecording}
  // >
  //   <i className="fa-solid fa-microphone "></i>
  // </button>;

  {
    /* {recordedUrl && <audio controls src={recordedUrl} />}
    </div> */
  }
};

export default Recorder;
