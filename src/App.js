import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaFolderOpen } from "react-icons/fa";

const App = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [songs, setSongs] = useState([
    { title: "Blinding Lights", src: "/songs/Blinding Lights.mp3" },
    { title: "Lose Yourself to Dance", src: "/songs/Lose Yourself to Dance (feat. Pharrell Williams).mp3" },
    { title: "Popular", src: "/songs/Popular(PagalNew.Com.Se).mp3" },
    { title: "Seven Nation Army", src: "/songs/Seven Nation Army.mp3" }
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    // Start playing the first preset song when the site loads
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Playback error: ", err));
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = () => {
    const duration = audioRef.current.duration || 0;
    const currentTime = audioRef.current.currentTime || 0;
    setProgress((currentTime / duration) * 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);

      setTimeout(() => {
        audioRef.current.load();
        audioRef.current.play().catch((err) => console.error("Playback error: ", err));
        setIsPlaying(true);
      }, 100); // Small delay for smooth transition
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prevIndex);

      setTimeout(() => {
        audioRef.current.load();
        audioRef.current.play().catch((err) => console.error("Playback error: ", err));
        setIsPlaying(true);
      }, 100);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFolderUpload = (event) => {
    const files = event.target.files;
    const newSongs = [];
    for (let i = 0; i < files.length; i++) {
      newSongs.push({ title: files[i].name, src: URL.createObjectURL(files[i]) });
    }
    setSongs([...songs, ...newSongs]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <div
        className={`player-card relative w-[200px] h-[300px] rounded-lg backdrop-blur-xl bg-white/10 shadow-lg overflow-hidden transform transition-all duration-500 hover:w-[350px] hover:h-[350px] flex-col`}
      >
        <audio
          ref={audioRef}
          src={songs[currentSongIndex].src}
          onTimeUpdate={handleProgress}
        ></audio>

        {/* Song Title */}
        <div className="text-lg font-semibold text-white text-center font-orbitron mt-2">
          {songs[currentSongIndex].title}
        </div>

        {/* Progress Bar */}
        <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
          <input
            type="range"
            className="w-full appearance-none bg-transparent cursor-pointer"
            value={progress}
            onChange={(e) => {
              const newTime =
                (e.target.value / 100) * audioRef.current.duration;
              audioRef.current.currentTime = newTime;
              setProgress(e.target.value);
            }}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              height: "8px",
            }}
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>
              {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
            </span>
            <span>
              {audioRef.current ? formatTime(audioRef.current.duration) : "0:00"}
            </span>
          </div>
        </div>

        {/* Play/Control Buttons */}
        <div className="absolute bottom-14 left-4 right-4 flex justify-center items-center gap-3">
          <button onClick={handlePrev} className="text-xl text-white hover:text-blue-400">
            <FaStepBackward />
          </button>
          <button
            onClick={togglePlay}
            className="text-2xl text-white hover:text-green-400"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleNext} className="text-xl text-white hover:text-blue-400">
            <FaStepForward />
          </button>
        </div>

        {/* Volume Control - Moved Inside the Music Card */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <FaVolumeUp className="text-white" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full appearance-none bg-transparent cursor-pointer"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              height: "8px",
            }}
          />
        </div>
      </div>

      {/* Choose Folder Button - Centered and Outside the Music Card with Bump Animation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2">
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-white bg-blue-500 rounded-full p-2 flex items-center gap-2 transform transition-transform duration-300 hover:scale-105"
        >
          <FaFolderOpen />
          <span>Choose File</span>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFolderUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default App;

