
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'hi-In';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
let audioplay = false;


// Obtain it from your Wit.ai app's Settings page
const TOKEN = "F5GZFANLLAYWZKPYS7MERAGOTYZO2KFZ";


recognition.onresult = (event) => {
    console.log(event.results)
    let utteranceList = event.results;
    let latestUtterance = utteranceList[utteranceList.length - 1];
    let speechRecognition = latestUtterance[latestUtterance.length - 1];

    // Update text object with speech recognition transcription
    let transcript = speechRecognition.transcript.toLowerCase();
    let textEl = document.getElementById('input_speech');
    textEl.innerHTML = transcript;

    if (latestUtterance.isFinal) {
        // Exit the function if the wake word was not triggered to respect user privacy
        // if (!transcript.includes(`hey ${WAKE_WORD}`)) {
        //     // Provide the user with a suggestion on voice commands they can say
        //     textEl.setAttribute("text", `value:Try saying: 'Hey ${WAKE_WORD}, add a box'`);
        //     return;
        // }

        // Extract the utterance from the wake word
        let utterance = transcript;

        // Send the user's utterance to Wit.ai API for NLU inferencing
        fetch(`https://api.wit.ai/message?v=20210414&q=${utterance}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                var audio = new Audio('test.mp3');
                playAudio(audio)
                startTimer();

            });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    recognition.start();
});


function playAudio(audio) {
    audio.play();
}


function startTimer() {
    recognition.stop();
    audioplay = true
    console.log('recognition stopped')
    setTimeout(stopTimer, 4000);
}

function stopTimer() {
    console.log('timer finished. Now listening')
    recognition.start();
    audioplay = false;
}

recognition.onend = function () {
    if (audioplay == false) {
        recognition.start();
        console.log('audio not playing. Starting recognition.')
    } else {
        console.log('Audio playing not triggering event')
    }

}