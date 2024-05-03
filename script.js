// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

//Declares various objects to be used in the code

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let qualityName = document.getElementById("chordquality");
let keyContext = document.getElementById("keyContext");
let keyContextKey = document.getElementById("key");
let functionSelect = document.getElementById("whichFunction");
let statusCheck = document.getElementById("statusCheck");
let chordOne = document.getElementById("firstChord");
let chordTwo = document.getElementById("secondChord");
let chordThree = document.getElementById("thirdChord");
let chordFour = document.getElementById("fourthChord");
let tempo = document.getElementById("tempo");

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

//The following series of sections declare and run functions that assign values to a number of objects that the chord and progression generators use to generate chords.
//These functions include clarifying what note the chord generator should use as a root for the chord, the tempo of a chord progression, the quality of a chord, etc.

//This function also allows for key selection with the Key Context feature turned on. It assigns a MIDI note as the "root," which will later be compared to the user's inputed MIDI note to change chord quality automatically.

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

//This declaration sets the default key for the Key Context mode to C Major
let keyContextSelection = "C Major";

//This declares the "root of the chord" object to be used later
let root;

//These functions act as switches for the Key Context function to toggle.
//It adds a listener to enable Key Context Key Selection selection when the Key Context is set to On, and removes the listener when its Off
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

//A function that allows a chord to be assigned a quality via quality menu selection when Key Context is off
//When key context is on and a user attempts to change the quality, an error message is intentionally created by trying to run "null"
//This prevents the user from changing a chord quality manually while Key Context is on, as the quality change process happens automatically

let quality = "major";

function qualitySelect() {
  quality = qualityName.value;
  console.log(quality);
}

qualityName.addEventListener("change", function () {
  keyContextToggle ? null() : qualitySelect();
});

//These functions allow the program to run two different systems based on if the Chord Generator or the Progression Generator is activated
//The Chord Generator is the basic process of the software, and the Progression Generator simply adds a layer of math on top of it that runs it four times in a loop.

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

//These are declarations for objects in the Progression Generator. These are the four chords that users can change in a progression
let chordOneSelection = "I";
let chordTwoSelection = "I";
let chordThreeSelection = "I";
let chordFourSelection = "I";

//These functions add event listeners for the chord boxes in the Progression Generator section of the page
//First, functions that tie the value on the html to a "selection" object are declared

function chordOneAssigner() {
  chordOneSelection = chordOne.value;
  console.log(`The first chord in the progression is ${chordOneSelection}`);
}

function chordTwoAssigner() {
  chordTwoSelection = chordTwo.value;
  console.log(`The second chord in the progression is ${chordTwoSelection}`);
}

function chordThreeAssigner() {
  chordThreeSelection = chordThree.value;
  console.log(`The third chord in the progression is ${chordThreeSelection}`);
}

function chordFourAssigner() {
  chordFourSelection = chordFour.value;
  console.log(`The fourth chord in the progression is ${chordFourSelection}`);
}

// Then, these functions are given event listeners when a "progression selection" function is run.
// This function happens when the Progression Generator is turned on
function progressionSelection() {
  chordOne.addEventListener("change", chordOneAssigner);
  chordTwo.addEventListener("change", chordTwoAssigner);
  chordThree.addEventListener("change", chordThreeAssigner);
  chordFour.addEventListener("change", chordFourAssigner);
}

// This function runs when the Progression Generator is turned off. It removes the listeners for the chord progression boxes,
// So they can't be changed while the Chord Generator is working
function progressionSelectionDeactivate() {
  chordOne.removeEventListener("change", chordOneAssigner);
  chordTwo.removeEventListener("change", chordTwoAssigner);
  chordThree.removeEventListener("change", chordThreeAssigner);
  chordFour.removeEventListener("change", chordFourAssigner);
}

//This function is just saying "Turn on the chord boxes when the Progression Generator is on, then turn them off when the Chord Generator is on."
functionSelect.addEventListener("change", function () {
  if (functionSelect.value == "progressionGen") {
    progGenOn = true;
    console.log("The Progression Generator is On");
    progressionSelection();
  } else if (functionSelect.value == "chordGen") {
    progGenOn = false;
    console.log("The Chord Generator is On");
    progressionSelectionDeactivate();
  }
});

//Objects and functions for adjusting the tempo of the chord progression. The user inputs a tempo in BPM, and it is then converted into
//milliseconds to be used later by a sequencer function

let tempoInput;
tempo.value = 120;
let tempoInMilliseconds = 2000;

function tempoToMilliseconds(tempo) {
  return 60000 / tempo;
}

tempo.addEventListener("change", function () {
  tempoInput = tempo.value;
  tempoInMilliseconds = tempoToMilliseconds(tempoInput) * 4;
  console.log(`The tempo of the chord progression is ${tempoInput} BPM.`);
  console.log(`A note will play every ${tempoInMilliseconds} milliseconds.`);
});

//This is the end of the series of sections that deals with assigning values to things based on what the user does on the page
// The following section concerns what happens whenever the user plays a MIDI note, and which code to run if either the Chord Generator
// or Progression generator is on.

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

  //The following section is a massive if statement runs two different codes based on if the Progression Generator is on or off.
  // The first part of the code is for when the Progression Generator is ON
  // A tempoInterval object is declared for use later. This will specify at what times to send note on and off messages
  let tempoInterval;

  if (progGenOn == true) {
    myInput.addListener("noteon", function (someMIDI) {
      let currentRootNumber;

      // This function specifies the root of chords that the Chord Generator should play based on user selections on the page.
      // This function works based off of what MIDI pitch the user has held down on their controller. It changes the pitch values being sent
      // to the actual chord generator into other values based on the chord selection, so the user can get up to four different chords that
      // have completely different roots than the note they're currently holding down.
      function progressionLooper() {
        function firstChord() {
          if (chordOneSelection == "I") {
            currentRootNumber = someMIDI.note.number;
          } else if (chordOneSelection == "ii") {
            currentRootNumber = someMIDI.note.number + 2;
          } else if (chordOneSelection == "iii") {
            currentRootNumber = someMIDI.note.number + 4;
          } else if (chordOneSelection == "IV") {
            currentRootNumber = someMIDI.note.number + 5;
          } else if (chordOneSelection == "V") {
            currentRootNumber = someMIDI.note.number + 7;
          } else if (chordOneSelection == "vi") {
            currentRootNumber = someMIDI.note.number + 9;
          } else if (chordOneSelection == "viio") {
            currentRootNumber = someMIDI.note.number + 11;
          }
        }

        function secondChord() {
          if (chordTwoSelection == "I") {
            currentRootNumber = someMIDI.note.number;
          } else if (chordTwoSelection == "ii") {
            currentRootNumber = someMIDI.note.number + 2;
          } else if (chordTwoSelection == "iii") {
            currentRootNumber = someMIDI.note.number + 4;
          } else if (chordTwoSelection == "IV") {
            currentRootNumber = someMIDI.note.number + 5;
          } else if (chordTwoSelection == "V") {
            currentRootNumber = someMIDI.note.number + 7;
          } else if (chordTwoSelection == "vi") {
            currentRootNumber = someMIDI.note.number + 9;
          } else if (chordTwoSelection == "viio") {
            currentRootNumber = someMIDI.note.number + 11;
          }
        }

        function thirdChord() {
          if (chordThreeSelection == "I") {
            currentRootNumber = someMIDI.note.number;
          } else if (chordThreeSelection == "ii") {
            currentRootNumber = someMIDI.note.number + 2;
          } else if (chordThreeSelection == "iii") {
            currentRootNumber = someMIDI.note.number + 4;
          } else if (chordThreeSelection == "IV") {
            currentRootNumber = someMIDI.note.number + 5;
          } else if (chordThreeSelection == "V") {
            currentRootNumber = someMIDI.note.number + 7;
          } else if (chordThreeSelection == "vi") {
            currentRootNumber = someMIDI.note.number + 9;
          } else if (chordThreeSelection == "viio") {
            currentRootNumber = someMIDI.note.number + 11;
          }
        }

        function fourthChord() {
          if (chordFourSelection == "I") {
            currentRootNumber = someMIDI.note.number;
          } else if (chordFourSelection == "ii") {
            currentRootNumber = someMIDI.note.number + 2;
          } else if (chordFourSelection == "iii") {
            currentRootNumber = someMIDI.note.number + 4;
          } else if (chordFourSelection == "IV") {
            currentRootNumber = someMIDI.note.number + 5;
          } else if (chordFourSelection == "V") {
            currentRootNumber = someMIDI.note.number + 7;
          } else if (chordFourSelection == "vi") {
            currentRootNumber = someMIDI.note.number + 9;
          } else if (chordFourSelection == "viio") {
            currentRootNumber = someMIDI.note.number + 11;
          }
        }

        //The following function runs the chord functions specified above, but it does so in a loop, so when the firstChord function finishes,
        //The secondChord function begins. The "tempoInMilliseconds" object makes its reappearance from just above this giant "Note On" function, so
        //that the root of the chord changes in time with the tempo the user sets. However, by subtracting the time that this change happens by just a
        //millisecond before the note on message is sent, the root note will always be adjusted in time for the note on message
        //to be sent.

        function chordSequence() {
          setTimeout(function () {
            firstChord();
            setTimeout(function () {
              secondChord();
              setTimeout(function () {
                thirdChord();
                setTimeout(function () {
                  fourthChord();
                  // When the fourthChord function is called, the chordSequence parent function is also called, so that the process can loop.
                  chordSequence();
                }, tempoInMilliseconds - 1);
              }, tempoInMilliseconds - 1);
            }, tempoInMilliseconds - 1);
          }, tempoInMilliseconds - 1);
        }

        chordSequence();
      }

      progressionLooper();

      // This function sends note on messages to the code that generates chords. It is modified compared to when the Progression Generator
      // is off. It allows for the MIDI pitch number of the note being sent to be tweaked by the progression looper.
      function sendNoteOn() {
        let myNotes = {
          note: {
            identifier: someMIDI.note.identifier,
            number: currentRootNumber, // Sets the note number using the Root Number specified by the progression looper.
            rawAttack: someMIDI.note.rawAttack,
          },
        };
        console.log(myNotes.note.number); // Logs the note number of the note being sent

        // Sends the Note Number to the midiPocess (AKA the chord generator code)
        myNotes = midiProcess(myNotes, quality);

        // Sends the package of four note on messages to the MIDI output
        myOutput.sendNoteOn(myNotes);
      }

      // This runs the sendNoteOn function at an interval based on the info from the tempo change function.
      // i.e, user changes tempo, the notes get sent faster or slower
      tempoInterval = setInterval(sendNoteOn, tempoInMilliseconds);
    });
    // With this function, when a note off message is sent by the user lifting their finger from a key, the loop of sendNoteOn messages is stopped
    myInput.addListener("noteoff", function (someMIDI) {
      clearInterval(tempoInterval);
    });
  } else {
    //THIS is the start of the "send a note" code if the progression generator is OFF. It's way smaller by comparison.
    myInput.addListener("noteon", function (someMIDI) {
      // This function doesn't even mess with MIDI note values. Whatever the pitch of the note that the user plays is, it gets shipped off to the
      //chord generator code as is. No timing stuff either, it just happens as soon as a note is played.
      let myNotes = midiProcess(someMIDI, quality);
      console.log(myNotes);

      myOutput.sendNoteOn(myNotes);
    });
    myInput.addListener("noteoff", function (someMIDI) {
      //And here, a note off message is sent to the MIDI output when the user sends a note off message by lifting their finger.

      myOutput.sendNoteOff(midiProcess(someMIDI, quality));
    });
  }
});

//This is the end of the "Note on" part of the code
//Below is the the code where singular MIDI pitch values are turned into four different pitches (based on quality,) to be packaged up in an array
//and spit back out to be sent to the MIDI output.

const midiProcess = function (midiIN, quality) {
  let pitch = midiIN.note.number;

  //This if statement runs two very similar codes based on if the progression generator option is on or off on the webpage. The only difference is
  //that if the progression generator is on, the user cannot turn on "keyContextToggle", which would interfere with the code by changing chord
  //qualities that don't need to be changed. When the progression generator isn't set to on, keyContextToggle is available, and will also let the user
  //select the quality of their individual chord when keyContextToggle is off.

  //Basically, this code reads the incoming MIDI pitch value, and changes the quality object to match what a chord would be within the context of a specific
  //scale. So, for example, when the key is set to A major and a B pitch comes into the function, it sets the quality to "minor" because a
  //B chord would be a minor ii in the key of A major. This quality is then read later in this code.
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

  //Finally, where the magic happens. A series of four notes are created and outputted by the midiProcess function based on the root note's pitch
  //and what the quality value is at that given moment.

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

//This is the end of the midiProcess part of this code.

// To sum it up, this entire code is just: Define objects based on user input, send a note to a midiProcess function, and together with the
// note and all of the defined objects, generate four notes to be sent to the MIDI output

// The function below adds event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

//This bonus section controls the status check function. Whenever the button on the webpage is clicked, a bunch of information anbout
//the current state of the software is logged in the console. This helps me see what the code thinks things are, and if there are any discrepancies
//between whats being shown on the webpage and what's happening under the hood.

statusCheck.addEventListener("click", function () {
  console.log(`Progression Generator? ${progGenOn}`);
  console.log(`Chord Quality: ${quality}`);
  console.log(`Key Context: ${keyContextToggle}`);
  console.log(`Key Context Key: ${keyContextSelection}`);
  console.log(`The Tempo of the Chord Progression is ${tempoInput}`);
});
