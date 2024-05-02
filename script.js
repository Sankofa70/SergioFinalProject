// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let qualityName = document.getElementById("chordquality");
let keyContext = document.getElementById("keyContext");
let keyContextKey = document.getElementById("key");
let functionSelect = document.getElementById("whichFunction");
let statusCheck = document.getElementById("statusCheck");

// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
// This loop iterates over all detected output devices, adding them to the dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

// A function that detects whether the Key Context setting is on or off. When on, it disables the code that allows user input for the Chord Quality

//The commented code below is to run the program when Key Context is OFF. It worked before, but not right now.

//This code also allows for key selection with the Key Context feature turned on. It assigns a MIDI note as the "root," which will later be compared to the user's inputed MIDI note to change chord quality automatically.

function kcKeySelect() {
  keyContextSelection = keyContextKey.value;
  console.log(`The current key is ${keyContextSelection}.`);
  if (keyContextSelection == "C Major") {
    root = 60;
  } else if (keyContextSelection == "C# Major") {
    root = 61;
  } else if (keyContextSelection == "D Major") {
    root = 62;
  } else if (keyContextSelection == "Eb Major") {
    root = 63;
  } else if (keyContextSelection == "E Major") {
    root = 64;
  } else if (keyContextSelection == "F Major") {
    root = 65;
  } else if (keyContextSelection == "F# Major") {
    root = 66;
  } else if (keyContextSelection == "G Major") {
    root = 67;
  } else if (keyContextSelection == "Ab Major") {
    root = 68;
  } else if (keyContextSelection == "A Major") {
    root = 69;
  } else if (keyContextSelection == "Bb Major") {
    root = 70;
  } else if (keyContextSelection == "B Major") {
    root = 71;
  }
}

//These functions act as switches for the Key Context function to toggle. It enables Key Context Key selection when the Key Context is set to On, and disables it when its set to Off
let keyContextToggle = false;

function kcToggleOn() {
  if (keyContext.value == "off") {
    keyContextToggle = false;
    keyContextKey.removeEventListener("change", kcKeySelect);
  }
  console.log("Key Context is Off");
}
function kcToggleOff() {
  if (keyContext.value == "on") {
    keyContextToggle = true;
  }
  console.log("Key Context is On");
}

keyContext.addEventListener("change", function () {
  keyContextToggle ? kcToggleOn() : kcToggleOff();

  if (keyContextToggle == true) {
    keyContextKey.addEventListener("change", kcKeySelect);
  } else if (keyContextToggle == false) {
    keyContextKey.removeEventListener("change", kcKeySelect);
  }
});

//A function that allows the script to react when a quality is selected on the quality dropdown menu. (Assuming Key Context is Off)

let quality = "major";

function qualitySelect() {
  quality = qualityName.value;
  console.log(quality);
}

qualityName.addEventListener("change", function () {
  keyContextToggle ? null() : qualitySelect();
});
//Declarations for the following function, assuming Key Context is ON.

let keyContextSelection = "C Major";
let root;

//These functions allow the program to react differently based on if the Chord Generator or the Progression Generator is activated

let progGenOn = false;

function progressionGeneratorOn() {
  if (functionSelect.value == "progressionGen") {
    progGenOn = true;
  }
  console.log(progGenOn);
}
function chordGeneratorOn() {
  if (functionSelect.value == "chordGen") {
    progGenOn = false;
  }
  console.log(progGenOn);
}

functionSelect.addEventListener("change", function () {
  if (functionSelect.value == "progressionGen") {
    progGenOn = true;
    console.log("The Progression Generator is On");
  } else if (functionSelect.value == "chordGen") {
    progGenOn = false;
    console.log("The Chord Generator is On");
  }
  console.log(progGenOn);
});

//Based on the value of the MIDI note number compared to the root of the selected key's note number, change the quality of the chord. For now, this will only work with MIDI notes 60 - 72.
//This also prevents the user from playing notes outside of their selected scale (Within the MIDI Note 60-72 Octave)

// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.

dropIns.addEventListener("change", function () {
  // Before changing the input device, remove any existing event listeners
  // to prevent them from being called after the device has been changed.
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  // Change the input device based on the user's selection in the dropdown.
  myInput = WebMidi.inputs[dropIns.value];

  let intervalID;
  if (progGenOn == true) {
    myInput.addListener("noteon", function (someMIDI) {
      // Create a new MIDI message object with the desired note number (60)
      let myNotes = {
        note: {
          identifier: someMIDI.note.identifier,
          number: 60, // Set the note number to 60
          rawAttack: someMIDI.note.rawAttack,
        },
      };
      console.log(myNotes.note.number);
      // Process the MIDI message with the fixed note number
      myNotes = midiProcess(myNotes, quality);

      // Define a function to send note-on messages
      function sendNoteOn() {
        myOutput.sendNoteOn(myNotes);
      }

      // Set an interval to repeatedly send note-on messages and store its ID
      intervalID = setInterval(sendNoteOn, 1000);
    });

    myInput.addListener("noteoff", function (someMIDI) {
      // Clear the interval set in the "noteon" section
      clearInterval(intervalID);
    });
  } else {
    myInput.addListener("noteon", function (someMIDI) {
      // When a note on event is received, send a note on message to the output device.
      // This can trigger a sound or action on the MIDI output device.

      let myNotes = midiProcess(someMIDI, quality);
      console.log(myNotes);

      myOutput.sendNoteOn(myNotes);

      // });
    });
    myInput.addListener("noteoff", function (someMIDI) {
      // Similarly, when a note off event is received, send a note off message to the output device.
      // This signals the end of a note being played.

      myOutput.sendNoteOff(midiProcess(someMIDI, quality));
    });
  }
});

//An inefficient way of generating four MIDI notes from one, using the MIDI Note Number, and a quality assignment

const midiProcess = function (midiIN, quality) {
  let pitch = midiIN.note.number;

  if (progGenOn == true) {
    console.log("The Progression Generator is Working");
    keyContextToggle = true;
    qualityName.removeEventListener("change", qualitySelect);
    if (keyContextToggle == true) {
      if (pitch == root) {
        quality = "major";
      } else if (pitch == root + 1) {
        quality = null;
      } else if (pitch == root + 2) {
        quality = "minor";
      } else if (pitch == root + 3) {
        quality = null;
      } else if (pitch == root + 4) {
        quality = "minor";
      } else if (pitch == root + 5) {
        quality = "major";
      } else if (pitch == root + 6) {
        quality = null;
      } else if (pitch == root + 7) {
        quality = "major";
      } else if (pitch == root + 8) {
        quality = null;
      } else if (pitch == root + 9) {
        quality = "minor";
      } else if (pitch == root + 10) {
        quality = null;
      } else if (pitch == root + 11) {
        quality = "minor";
      } else if (pitch == root + 12) {
        quality = "major";
      }
    }
  } else {
    console.log("The Chord Generator is Working");
    if (keyContextToggle == false) {
      qualityName.addEventListener("change", qualitySelect);
    } else if (keyContextToggle == true) {
      qualityName.removeEventListener("change", qualitySelect);
      if (pitch == root) {
        quality = "major";
      } else if (pitch == root + 1) {
        quality = null;
      } else if (pitch == root + 2) {
        quality = "minor";
      } else if (pitch == root + 3) {
        quality = null;
      } else if (pitch == root + 4) {
        quality = "minor";
      } else if (pitch == root + 5) {
        quality = "major";
      } else if (pitch == root + 6) {
        quality = null;
      } else if (pitch == root + 7) {
        quality = "major";
      } else if (pitch == root + 8) {
        quality = null;
      } else if (pitch == root + 9) {
        quality = "minor";
      } else if (pitch == root + 10) {
        quality = null;
      } else if (pitch == root + 11) {
        quality = "minor";
      } else if (pitch == root + 12) {
        quality = "major";
      }
    }
  }

  //Put all outcome code in here
  //Don't use function in here--All one big function

  if (quality == "major") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 4, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 7, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 12, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "major7th") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 4, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 7, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 11, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "minor") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 3, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 7, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 12, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "minor7th") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 3, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 7, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 10, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "dominant") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 4, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 7, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 10, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "halfDiminished") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 3, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 6, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 10, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  } else if (quality == "fullDiminished") {
    let myNewNote1 = new Note(pitch, { rawAttack: 101 });
    let myNewNote2 = new Note(pitch + 3, { rawAttack: 101 });
    let myNewNote3 = new Note(pitch + 6, { rawAttack: 101 });
    let myNewNote4 = new Note(pitch + 9, { rawAttack: 101 });
    return [myNewNote1, myNewNote2, myNewNote3, myNewNote4];
  }
};

console.log(myOutput);
// Add an event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

//Three Problems with the Code: Note On Messages are getting duplicated, The Chord Context function is getting overrided, I want to be able to change between the Progression and Chord Generator

statusCheck.addEventListener("click", function () {
  console.log(`Progression Generator? ${progGenOn}`);
  console.log(`Chord Quuality: ${quality}`);
  console.log(`Key Context: ${keyContextToggle}`);
  console.log(`Key Context Key: ${keyContextSelection}`);
});
