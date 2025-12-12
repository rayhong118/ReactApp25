import { useEffect, useState } from "react";
import { useAddMessageBars } from "@/utils/MessageBarsAtom";

export const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}:${String(milliseconds).padStart(3, "0")}`;
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const addMessageBars = useAddMessageBars();

  return (
    <div className="p-20">
      StopWatch Experiment Page
      <div>{formatTime(time)}</div>
      <button
        className="p-2 border cursor-pointer"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        className="p-2 border cursor-pointer disabled:bg-gray-300"
        onClick={() => setTime(0)}
        disabled={isRunning}
      >
        Reset
      </button>

      <button onClick={() => addMessageBars([
        {
          id: new Date().toISOString(),
          message: "Note added successfully",
          type: "success",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        },
      ])}> add a new message bar</button>
    </div>
  );
};
