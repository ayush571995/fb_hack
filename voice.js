const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'hi-In';
recognition.interimResults = false;
recognition.maxAlternatives = 1;



// Obtain it from your Wit.ai app's Settings page
const TOKEN = "F5GZFANLLAYWZKPYS7MERAGOTYZO2KFZ";

document.getElementById('capture').addEventListener('click', function () {
    recognition.start();
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
                });
        }
    }
})

document.getElementById('stop-capture').addEventListener('click', function () {
    recognition.stop();
})