// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let qualityName = document.getElementById("chordquality");
let keyContext = document.getElementById("keyContext");

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

let keyContextToggle = "off";

keyContext.addEventListener("change", function () {
  keyContextToggle = keyContext.value;
  console.log(keyContextToggle);
  return keyContextToggle;
});

//A function that allows the script to react when a different quality is selected on the quality dropdown menu.

//if (keyContextToggle == "off") {
let quality = "major";

qualityName.addEventListener("change", function () {
  quality = qualityName.value;
  console.log(quality);
});
//} else {
//let quality = scaleDegree.Qual;
//}

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

  // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
  // These listeners will handle MIDI note on (key press) and note off (key release) messages.
  myInput.addListener("noteon", function (someMIDI) {
    // When a note on event is received, send a note on message to the output device.
    // This can trigger a sound or action on the MIDI output device.
    console.log(
      `My note is ${someMIDI.note.identifier}, it is pitch ${someMIDI.note.number}, with a velocity of ${someMIDI.note.rawAttack}`
    );

    myOutput.sendNoteOn(midiProcess(someMIDI, quality));
  });

  myInput.addListener("noteoff", function (someMIDI) {
    // Similarly, when a note off event is received, send a note off message to the output device.
    // This signals the end of a note being played.

    myOutput.sendNoteOff(midiProcess(someMIDI, quality));
  });
});

//Doing the dot thing gets a value/object from the thing. You have to make an object in the object to get it to call

const midiProcess = function (midiIN, quality) {
  let pitch = midiIN.note.number;

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
    let myNewNote4 = new Note(pitch + 11, { rawAttack: 101 });
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
