document.addEventListener("DOMContentLoaded", () => {

  const base = "./music";

  const songsRaw = [
    ["Black & Blue", "Avicii feat. Aloe Blacc, Mac Davis"],
    ["Bright Lights (Version 1)", "Avicii, Syn Cole"],
    ["Bright Lights (Version 2)", "Avicii, Syn Cole"],
    ["Broken Heart & Hennessy", "Avicii feat. Mike Posner"],
    ["Can't Get Enough", "Avicii, Cazzette feat. The High"],
    ["Can't Love You Again", "Avicii, Tom Odell"],
    ["Chained", "Avicii, AlexST"],
    ["Enough is Enough", "Avicii"],
    ["Faster Than Light", "Avicii feat. Sandro Cavazza"],
    ["Finally", "Avicii, Kings Of Tomorrow feat. Julie McKnight"],
    ["Heaven", "Avicii feat. Simon Aldred"],
    ["How Many Lovers", "Avicii feat. Simon Aldred"],
    ["I'll Be Gone", "Avicii feat. Joakim Berg"],
    ["Unbreakable", "Avicii, BUNT feat. Sandro Cavazza & Clarece Coffee Jr"],
    ["Live Your Life", "Avicii, Afrojack, David Guetta, Ne-Yo"],
    ["Lord", "Avicii, Sandro Cavazza"],
    ["Make Your Move", "Avicii, Redroche, Dave Armstrong"],
    ["No Pleasing A Woman", "Avicii"],
    ["Our Love", "Avicii feat. Sandro Cavazza"],
    ["Revolver", "Avicii, Philter"],
    ["Rock Me", "Avicii, Mike Posner"],
    ["Silence", "Avicii"],
    ["Someone New", "Avicii, Triangle"],
    ["Somethings Got A Hold On Me vs Levels", "Avicii, Skrillex, Etta James"],
    ["Stepping Stone", "Avicii, AlexST"],
    ["Street Player", "Avicii, Chicago"],
    ["Sunshine vs Spectrum", "Avicii & David Guetta vs. Florence & Machine"],
    ["Take Me In Your Arms", "Avicii, The Isley Brothers"],
    ["T-Bone", "Avicii"],
    ["The Other Side", "Avicii feat. Cam"],
    ["UMF 2013", "Avicii"]
  ];

  const songs = songsRaw.map(([name,artist]) => ({
    name,
    artist,
    album:"Single",
    url:`${base}/track/${name}.mp3`,
    cover_art_url:`${base}/cover/${name}.jpg`
  }));

  Amplitude.init({ songs });

  const playlist = document.getElementById("playlist");
  const panel = document.getElementById("playlist-panel");

  songs.forEach((s,i) => {
    const el = document.createElement("div");
    el.textContent = s.name + " — " + s.artist;

    el.classList.add("amplitude-song-container");
    el.setAttribute("data-amplitude-song-index", i);

    el.addEventListener("click", () => {
      Amplitude.playSongAtIndex(i);
      setTimeout(() => panel.classList.remove("active"), 150);
    });

    playlist.appendChild(el);
  });

  Amplitude.bindNewElements();

  document.getElementById("open-playlist").onclick = () => panel.classList.add("active");
  document.getElementById("close-playlist").onclick = () => panel.classList.remove("active");

  const bg = document.getElementById("bg-blur");

  Amplitude.on("song_change", () => {
    const song = Amplitude.getActiveSongMetadata();
    bg.style.background = `url('${song.cover_art_url}') center/cover no-repeat`;
  });

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 60;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;

  const source = audioCtx.createMediaElementSource(Amplitude.getAudio());
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const barWidth = canvas.width / bufferLength;
    for(let i=0;i<bufferLength;i++){
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = "#1db954";
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
  }

  draw();
});
