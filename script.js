/* ==========================================
   SCOUT BHAI BIRTHDAY CARD
========================================== */


const card =
  document.getElementById("card");

const openBtn =
  document.getElementById("openBtn");

const closeBtn =
  document.getElementById("closeBtn");

const continueBtn =
  document.getElementById("continueBtn");

const music =
  document.getElementById("birthdayMusic");

const musicBtn =
  document.getElementById("musicBtn");

const game =
  document.getElementById("game");

const candleStage =
  document.getElementById("candleStage");

const cakeStage =
  document.getElementById("cakeStage");

const finalStage =
  document.getElementById("finalStage");

const giftStage =
  document.getElementById("giftStage");

const flame =
  document.getElementById("flame");

const micBtn =
  document.getElementById("micBtn");

const tapBlow =
  document.getElementById("tapBlow");

const micStatus =
  document.getElementById("micStatus");

const cutCakeBtn =
  document.getElementById("cutCakeBtn");

const giftBtn =
  document.getElementById("giftBtn");

const giftBox =
  document.getElementById("giftBox");

const giftHint =
  document.getElementById("giftHint");

const toyStage =
  document.getElementById("toyStage");

const sayAgainBtn =
  document.getElementById("sayAgainBtn");


let musicPlaying = false;

let audioContext = null;

let analyser = null;

let microphoneStream = null;

let animationFrame = null;


/* ==========================================
   OPEN CARD
========================================== */

openBtn.addEventListener(
  "click",
  () => {

    card.classList.add("open");

    /*
      Browser normally allows music
      after a user click.
    */

    startMusic();

  }
);


/* ==========================================
   CLOSE CARD
========================================== */

closeBtn.addEventListener(
  "click",
  () => {

    card.classList.remove("open");

    card.classList.remove("game-mode");

    stopMicrophone();

    resetEverything();

  }
);


/* ==========================================
   MUSIC
========================================== */

function startMusic() {

  music.volume = 0.45;

  music.play()
    .then(() => {

      musicPlaying = true;

      musicBtn.textContent = "🔊";

    })
    .catch(() => {

      /*
        Some browsers may block
        automatic audio.

        User can press the music
        button manually.
      */

      musicPlaying = false;

    });
}


function toggleMusic() {

  if (music.paused) {

    music.play();

    musicPlaying = true;

    musicBtn.textContent = "🔊";

  } else {

    music.pause();

    musicPlaying = false;

    musicBtn.textContent = "🔇";

  }

}


musicBtn.addEventListener(
  "click",
  toggleMusic
);


/* ==========================================
   CONTINUE TO CANDLE
========================================== */

continueBtn.addEventListener(
  "click",
  () => {

    card.classList.add("game-mode");

    candleStage.style.display =
      "flex";

    cakeStage.style.display =
      "none";

    finalStage.style.display =
      "none";

    giftStage.style.display =
      "none";

  }
);


/* ==========================================
   BLOW CANDLE
========================================== */

tapBlow.addEventListener(
  "click",
  candleOut
);


micBtn.addEventListener(
  "click",
  startMicrophone
);


async function startMicrophone() {

  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {

    micStatus.textContent =
      "Microphone isn't supported here. Tap the button below.";

    return;

  }


  try {

    microphoneStream =
      await navigator.mediaDevices
        .getUserMedia({
          audio: true
        });


    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();


    const source =
      audioContext
        .createMediaStreamSource(
          microphoneStream
        );


    analyser =
      audioContext.createAnalyser();


    analyser.fftSize = 512;


    source.connect(analyser);


    const data =
      new Uint8Array(
        analyser.fftSize
      );


    micStatus.textContent =
      "Listening… Blow now! 🌬️";


    let blowCount = 0;


    function detectBlow() {

      if (
        !analyser ||
        flame.classList.contains("out")
      ) {

        return;

      }


      analyser.getByteTimeDomainData(
        data
      );


      let sum = 0;


      for (
        let i = 0;
        i < data.length;
        i++
      ) {

        const value =
          (data[i] - 128) / 128;

        sum += value * value;

      }


      const volume =
        Math.sqrt(
          sum / data.length
        );


      /*
        Blow threshold.
        If needed you can change
        0.13 to 0.10 or 0.16.
      */

      if (volume > 0.13) {

        blowCount++;

      } else {

        blowCount = 0;

      }


      if (blowCount >= 5) {

        candleOut();

        return;

      }


      animationFrame =
        requestAnimationFrame(
          detectBlow
        );

    }


    detectBlow();


  } catch (error) {

    micStatus.textContent =
      "Microphone permission denied. Use 'Tap to blow it out'.";

  }

}


/* ==========================================
   CANDLE OUT
========================================== */

function candleOut() {

  if (
    flame.classList.contains("out")
  ) {

    return;

  }


  flame.classList.add("out");


  stopMicrophone();


  setTimeout(
    () => {

      candleStage.style.display =
        "none";

      cakeStage.style.display =
        "flex";

      document.getElementById(
        "gameTitle"
      ).textContent =
        "Now cut your cake! 🍰";

    },
    800
  );

}


/* ==========================================
   STOP MICROPHONE
========================================== */

function stopMicrophone() {

  if (animationFrame) {

    cancelAnimationFrame(
      animationFrame
    );

    animationFrame = null;

  }


  if (microphoneStream) {

    microphoneStream
      .getTracks()
      .forEach(
        track => track.stop()
      );

    microphoneStream = null;

  }


  if (audioContext) {

    audioContext
      .close()
      .catch(() => {});

    audioContext = null;

  }


  analyser = null;

}


/* ==========================================
   CUT CAKE
========================================== */

cutCakeBtn.addEventListener(
  "click",
  () => {

    const cake =
      document.querySelector(
        ".cake"
      );


    cake.classList.add(
      "cut"
    );


    setTimeout(
      () => {

        cakeStage.style.display =
          "none";

        finalStage.style.display =
          "flex";

        document.getElementById(
          "gameTitle"
        ).textContent =
          "Birthday mission complete! 🎉";

      },
      800
    );

  }
);


/* ==========================================
   GIFT BUTTON
========================================== */

giftBtn.addEventListener(
  "click",
  () => {

    finalStage.style.display =
      "none";

    giftStage.style.display =
      "flex";

    document.getElementById(
      "gameTitle"
    ).textContent =
      "Your surprise gift 🎁";

  }
);


/* ==========================================
   OPEN GIFT
========================================== */

giftBox.addEventListener(
  "click",
  () => {

    if (
      giftBox.classList.contains(
        "opened"
      )
    ) {

      return;

    }


    giftBox.classList.add(
      "opened"
    );


    giftHint.textContent =
      "Opening your gift… 🕷️";


    setTimeout(
      () => {

        giftBox.style.display =
          "none";

        giftHint.style.display =
          "none";

        toyStage.style.display =
          "flex";


        /*
          Make the toy speak.
        */

        speakBirthday();

      },
      1000
    );

  }
);


/* ==========================================
   SPIDER-MAN TOY VOICE
========================================== */

function speakBirthday() {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  speechSynthesis.cancel();


  const voice =
    new SpeechSynthesisUtterance(
      "Scout, Happy Birthday!"
    );


  voice.rate = 0.82;

  voice.pitch = 1.15;

  voice.volume = 1;


  speechSynthesis.speak(
    voice
  );

}


/* ==========================================
   SAY AGAIN
========================================== */

sayAgainBtn.addEventListener(
  "click",
  speakBirthday
);


/* ==========================================
   RESET
========================================== */

function resetEverything() {

  candleStage.style.display =
    "flex";

  cakeStage.style.display =
    "none";

  finalStage.style.display =
    "none";

  giftStage.style.display =
    "none";


  toyStage.style.display =
    "none";


  giftBox.style.display =
    "block";


  giftBox.classList.remove(
    "opened"
  );


  giftHint.style.display =
    "block";


  flame.classList.remove(
    "out"
  );


  document.getElementById(
    "gameTitle"
  ).textContent =
    "Make a wish! 🎂";


  micStatus.textContent =
    "Allow microphone and blow toward your phone.";

}


/* ==========================================
   START
========================================== */

resetEverything();
