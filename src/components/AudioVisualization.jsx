import { useRef, useState } from "react";
import useTheme from "../hooks/useTheme";

const AudioVisualization = () => {
  const [message, setMessage] = useState("");
  const [startBtnDisabled, setStartBtnDisabled] = useState(true);
  const [stopBtnDisabled, setStopBtnDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const {setCurrentTheme, visualize} = useTheme();
  const canvas = useRef(null);
  const source = useRef(null);
  const jsNode = useRef(null);

  const uploadFile = async ({ target: { files } }) => {
    files[0] && setFile(files[0]);
    setStartBtnDisabled(false);
  };

  const handleStart = async () => {
    setMessage("Configuring audio stack…");
    const audioContext = new AudioContext();
    const downloadedBuffer = await file.arrayBuffer();
    const decodedBuffer = await audioContext.decodeAudioData(downloadedBuffer);

    // Set up the AudioBufferSourceNode
    source.current = new AudioBufferSourceNode(audioContext, {
      buffer: decodedBuffer,
      loop: true,
    });

    // Set up the audio analyser and the javascript node
    const analyserNode = new AnalyserNode(audioContext);
    jsNode.current = audioContext.createScriptProcessor(1024, 1, 1);

    // Connect the nodes together
    source.current.connect(audioContext.destination);
    source.current.connect(analyserNode);
    analyserNode.connect(jsNode.current);
    jsNode.current.connect(audioContext.destination);
    // Set up the event handler that is triggered every time enough samples have been collected
    // then trigger the audio analysis and draw the results
    jsNode.current.onaudioprocess = () => {
      handleAudioProcess(audioContext, analyserNode);
    };

    // Play the audio
    setMessage("Audio playing…");
    source.current.start(0); // Play the sound now
    setStartBtnDisabled(true);
    setStopBtnDisabled(false);
  };

  const handleStop = () => {
    setStartBtnDisabled(false);
    setStopBtnDisabled(true);
    source.current.stop(0);
    jsNode.current.onaudioprocess = null;
    setMessage("Audio stopped.");
  };

  const handleAudioProcess = (audioContext, analyserNode) => {
    // Read the frequency values
    const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);

    // Get the time domain data for this sample
    analyserNode.getByteTimeDomainData(amplitudeArray);

    // Draw the display when the audio is playing
    if (audioContext.state === "running") {
      // Draw the time domain in the canvas
      requestAnimationFrame(() => {
        visualize(canvas, amplitudeArray);
      });
    }
  };

  return (
    <div>
      <h1>Audio file analyzer</h1>
      <div>
        Theme: 
        <select onChange={(e) => {
          setCurrentTheme(e.target.value);
        }}>
          <option>plain</option>
          <option>colorful</option>
        </select>
      </div>
      <div>
        <input type="file" onChange={uploadFile} />
      </div>
      <canvas
        width="1024"
        height="256"
        ref={canvas}
        style={{ backgroundColor: "black" }}
      ></canvas>

      <div>
        <button onClick={handleStart} disabled={startBtnDisabled}>
          Start
        </button>
        &nbsp; &nbsp;
        <button onClick={handleStop} disabled={stopBtnDisabled}>
          Stop
        </button>
        <br />
        <br />
        <output>{message}</output>
      </div>
    </div>
  );
};

export default AudioVisualization;
