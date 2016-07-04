var scales = {
    "major":    [0,2,2,1,2,2,2,1],
    "n-minor":  [0,2,1,2,2,1,2,2],
    "h-minor":  [0,2,1,2,2,1,3,1],
    "m-minor":  [0,2,1,2,2,2,2,1]
}
var lastNoteID = 0;


function getScaleNoteName(currentScale,degree){
    degree -= 1;
    degree = degree%7;
    var retVal = "";
    var scaleNames = [
        "Tonic",
        "Supertonic",
        "Mediant",
        "Subdominant",
        "Dominant",
        "Submediant",
        "Leading Tone/Subtonic",
        "Tonic"
    ];
    if(degree!=6){
        retVal = scaleNames[degree];
    }
    else{
        if(scales[currentScale][7]<2){
            retVal = "Leading Tone";
        }
        else{
            retVal = "Subtonic";
        }
    }
    return retVal;
} // get scale degree, return name on scale for currentScale

function updateScale(newScale){
    var retStr = "";
    var tonic = {"note":"C","octave":"4","accidental":"#"};
    var tonicID = getMidiID(tonic.note,tonic.octave,tonic.accidental);
    var scale = scales[newScale];
    var currNoteID = tonicID;
    for(var i=0;i<scale.length;i++){
        currNoteID = currNoteID + scale[i];
        retStr += "  " + getNoteString(currNoteID);
    }
    console.log(retStr);
} // test

function getMidiID(note,octave,accidental){
    var noteVals = {
        "C":0,
        "D":2,
        "E":4,
        "F":5,
        "G":7,
        "A":9,
        "B":11
    }
    var octOffset = octave*12;
    var accOffset = 0;
    switch(accidental){
        case "b":
            accOffset = -1;
            break;
        case "bb":
            accOffset = -2;
            break;
        case "#":
            accOffset = 1;
            break;
        case "x":
            accOffset = 2;
            break;
        case "n":
            accOffset = 0;
            break;
        default:
            accOffset = 0;
    }
    var retVal = noteVals[note] + octOffset + accOffset;
    return retVal;
} // give not object, get midi ID

function getNote(ID){
    var octave = Math.floor(ID/12);
    var noteAcc = ID%12;
    var octOffset = octave*12;
    var accidental = 0;
    var note = 0;
    switch(noteAcc){
        case 0:
            note = "C";
            accidental = "n";
            break;
        case 1:
            note = "C";
            accidental = "#";
            break;
        case 2:
            note = "D";
            accidental = "n";
            break;
        case 3:
            note = "D";
            accidental = "#";
            break;
        case 4:
            note = "E";
            accidental = "n";
            break;
        case 5:
            note = "F";
            accidental = "n";
            break;
        case 6:
            note = "F";
            accidental = "#";
            break;
        case 7:
            note = "G";
            accidental = "n";
            break;
        case 8:
            note = "G";
            accidental = "#";
            break;
        case 9:
            note = "A";
            accidental = "n";
            break;
        case 10:
            note = "A";
            accidental = "#";
            break;
        case 11:
            note = "B";
            accidental = "n";
            break;
        default:
            ;
    }
    var freq = getFreq(ID);
    var retVal = {"note":note,"octave":octave,"accidental":accidental,"ID":ID,"frequency":freq};
    return retVal;
} // give midi ID, get note object

function getScale(scale,tonicID){
    var scaleNums = scales[scale];
    var currOffset = 0;
    var scaleNotes = [];
    for(var i=0;i<scaleNums.length;i++){
        currOffset += scaleNums[i];
        scaleNotes[i] = getNote(tonicID+currOffset);
    }
    return scaleNotes;
}

function getNoteAccString(ID){
    var noteObj = getNote(ID);
    var retString = noteObj.note + noteObj.accidental;
    return retString;
} // give midi ID, get string in form "C#"

function getNoteString(ID){
    var noteObj = getNote(ID);
    var retString = noteObj.note + noteObj.accidental + noteObj.octave;
    return retString;
} // give midi ID, get string in form "C#5"

function addMidiInput(ID,name){
    var midiSelect = document.getElementById("midi-in-select");
    var newOption = document.createElement("option");
    newOption.text = name;
    newOption.value = ID;
    midiSelect.add(newOption);
} // add

function getFreq(ID){
    var freqList = [
        8.1757989156, 8.661957218, 9.1770239974, 9.7227182413, 10.3008611535, 10.9133822323, 11.5623257097, 12.2498573744, 12.9782717994, 13.75, 14.5676175474, 15.4338531643, 16.3515978313, 17.3239144361, 18.3540479948, 19.4454364826, 20.6017223071, 21.8267644646, 23.1246514195, 24.4997147489, 25.9565435987, 27.5, 29.1352350949, 30.8677063285, 32.7031956626, 34.6478288721, 36.7080959897, 38.8908729653, 41.2034446141, 43.6535289291, 46.249302839, 48.9994294977, 51.9130871975, 55, 58.2704701898, 61.735412657, 65.4063913251, 69.2956577442, 73.4161919794, 77.7817459305, 82.4068892282, 87.3070578583, 92.4986056779, 97.9988589954, 103.826174395, 110, 116.5409403795, 123.470825314, 130.8127826503, 138.5913154884, 146.8323839587, 155.563491861, 164.8137784564, 174.6141157165, 184.9972113558, 195.9977179909, 207.65234879, 220, 233.081880759, 246.9416506281, 261.6255653006, 277.1826309769, 293.6647679174, 311.1269837221, 329.6275569129, 349.228231433, 369.9944227116, 391.9954359817, 415.3046975799, 440, 466.1637615181, 493.8833012561, 523.2511306012, 554.3652619537, 587.3295358348, 622.2539674442, 659.2551138257, 698.456462866, 739.9888454233, 783.9908719635, 830.6093951599, 880, 932.3275230362, 987.7666025122, 1046.5022612024, 1108.7305239075, 1174.6590716696, 1244.5079348883, 1318.5102276515, 1396.912925732, 1479.9776908465, 1567.981743927, 1661.2187903198, 1760, 1864.6550460724, 1975.5332050245, 2093.0045224048, 2217.461047815, 2349.3181433393, 2489.0158697766, 2637.020455303, 2793.825851464, 2959.9553816931, 3135.963487854, 3322.4375806396, 3520, 3729.3100921447, 3951.066410049, 4186.0090448096, 4434.92209563, 4698.6362866785, 4978.0317395533, 5274.0409106059, 5587.6517029281, 5919.9107633862, 6271.92697571, 6644.8751612791, 7040, 7458.6201842894, 7902.132820098, 8372.0180896192, 8869.8441912599, 9397.272573357, 9956.0634791066, 10548.0818212118, 11175.3034058561, 11839.8215267723, 12543.853951416
    ];
    var retVal;
    if(ID<0||ID>127){
        console.log("Requested MIDI ID outside range");
        retVal = -1;
    }
    else{
        retVal = freqList[ID];
    }
    return retVal;
//    var pow2 = 1.05946309436; // 12th root of 2
//    var retVal = 440 * Math.pow(pow2,ID-57); // freq for A5, and midi ID of A5
}

function getInterval(ID,quality,value){
    var intervals = {
        2   :   ["major"    , 2 ],
        3   :   ["major"    , 4 ],
        4   :   ["perfect"  , 5 ],
        5   :   ["perfect"  , 7 ],
        6   :   ["major"    , 9 ],
        7   :   ["major"    , 11],
        8   :   ["perfect"  , 12]
    }

    var retVal = 0;

    switch(quality){
        case "base":
            retVal = 0;
            break;
        case "major":
            if(intervals[value][0] != "major"){
                retVal = 0;
                console.log("No such interval exists");
            }
            else{
                retVal = intervals[value][1];
            }
            break;
        case "perfect":
            if(intervals[value][0] != "perfect"){
                retVal = 0;
                console.log("No such interval exists");
            }
            else{
                retVal = intervals[value][1];
            }
            break;
        case "minor":
            if(intervals[value][0] == "major"){
                retVal = intervals[value][1] - 1;
            }
            else{
                retVal = 0;
                console.log("No such interval exists");
            }
            break;
        case "augmented":
            retVal = intervals[value][1] + 1;
            break;
        case "diminished":
            retVal = intervals[value][1] - 1;
            break;
        default:
            console.log("Unknown quality");
    }
    retVal = retVal + ID;
    return retVal;
}

function invertInterval(quality,value){
    var retVal = {"quality":0,"value":0};
    var valueInv = {
        2:7,
        3:6,
        4:5,
        5:4,
        6:3,
        7:2
    };
    var qualityInv = {
        "major":"minor",
        "minor":"major",
        "perfect":"perfect",
        "augmented":"diminished",
        "diminished":"augmented"
    };
    retVal.quality = qualityInv[quality];
    retVal.value = valueInv[value];
    return retVal;
}

function getRelativeMajor(ID){
    var relMaj = {
        "C":"D#",
        "C#":"E",
        "D":"F",
        "D#":"F#",
        "E":"G",
        "F":"G#",
        "F#":"A",
        "G":"A#",
        "G#":"B",
        "A":"C",
        "A#":"C#",
        "B":"D"
    };
    var note = getNoteAccString(ID);
    var retVal = relMaj[note];
    return retVal;
}

function getRelativeMinor(ID){
    var relMin = {
        "D#"	:	"C",
        "E"		:	"C#",
        "F"		:	"D",
        "F#"	:	"D#",
        "G"		:	"E",
        "G#"	:	"F",
        "A"		:	"F#",
        "A#"	:	"G",
        "B"		:	"G#",
        "C"		:	"A",
        "C#"	:	"A#",
        "D"		:	"B"
    };
    var note = getNoteAccString(ID);
    var retVal = relMin[note];
    return retVal;
}

function getKeySigID(ID,scale){
    var scales = {
        "Cn-major":1,
        "An-minor":1,
        "Gn-major":2,
        "En-minor":2,
        "Dn-major":3,
        "Bn-minor":3,
        "An-major":4,
        "F#-minor":4,
        "En-major":5,
        "C#-minor":5,
        "Bn-major":6,
        "G#-minor":6,
        "F#-major":7,
        "D#-minor":7,
        "C#-major":8,
        "A#-minor":8,
        "Fn-major":17,
        "Dn-minor":17,
        "Bb-major":18,
        "Gn-minor":18,
        "Eb-major":19,
        "Cn-minor":19,
        "Ab-major":20,
        "Fn-minor":20,
        "Db-major":21,
        "Bb-minor":21,
        "Gb-major":22,
        "Eb-minor":22,
        "Cb-major":23,
        "Ab-minor":23
    }
    if(scale == "major" || scale == "n-minor"){
        var note = getNote(ID);
        var scaleID = "minor";
        if(scale=="major"){
            scaleID = "major";
        }
        var id = note.note + note.accidental + "-" + scaleID;
        var fileNum = scales[id];
        var tfile = "t1.jpg";
        var bfile = "b1.jpg";
        var offset = 8;
        if(fileNum>=17){
            tfile = "t2.jpg";
            bfile = "b2.jpg";
            var offset = 7;
        }
        var files = {
            "treble-file":tfile,
            "bass-file":bfile,
            "treble-signature":fileNum + ".jpg",
            "bass-signature":(fileNum+offset) +".jpg"
        }
    }
    else{
        console.log("No key signature for that scale");
    }
}

function getChord(type,rootID){
    chords = {
      "major-triad":                [ ["base",0],["major",3],["perfect",5]                      ],
      "minor-triad":                [ ["base",0],["minor",3],["perfect",5]                      ],
      "augmented-triad":            [ ["base",0],["major",3],["augmented",5]                    ],
      "diminished-triad":           [ ["base",0],["minor",3],["diminished",5]                   ],
      "dominant-seventh":           [ ["base",0],["major",3],["perfect",5],     ["minor",7]     ],
      "major-seventh":              [ ["base",0],["major",3],["perfect",5],     ["major",7]     ],
      "minor-seventh":              [ ["base",0],["minor",3],["perfect",5],     ["minor",7]     ],
      "half-diminished-seventh":    [ ["base",0],["minor",3],["diminished",5],  ["minor",7]     ],
      "diminished-seventh":         [ ["base",0],["minor",3],["diminished",5],  ["diminished",7]],
      "minor-major-seventh":        [ ["base",0],["minor",3],["perfect",5],     ["major",7]     ],
      "augmented-major-seventh":    [ ["base",0],["major",3],["augmented",5],   ["major",7]     ],
      "augmented-seventh":          [ ["base",0],["major",3],["augmented",5],   ["minor",7]     ]
    };
    var chord = chords[type];
    var chordNotes = [];
    for(var i=0;i<chord.length;i++){
        chordNotes[i] = getNote( getInterval(rootID,chord[i][0],chord[i][1]) );
    }
    return chordNotes;
}

function getChordString(type,rootID){
    var notes = getChord(type,rootID);
    var retVal = chord2String(notes);
    return retVal;
}

function chord2String(notes){
    var retStr = "";
    for(var i=0;i<notes.length;i++){
        retStr += getNoteString(notes[i].ID) + "   ";
    }
    return retStr;
}

function getDiatonicTriads(ID,scale){
    var diTri = {
        "major":    ["major-triad","minor-triad",       "minor-triad",        "major-triad","major-triad","minor-triad",        "diminished-triad"],
        "n-minor":  ["minor-triad","diminished-triad",  "major-triad",        "minor-triad","minor-triad","major-triad",        "major-triad"     ],
        "h-minor":  ["minor-triad","diminished-triad",  "augmented-triad",    "minor-triad","major-triad","major-triad",        "diminished-triad"],
        "m-minor":  ["minor-triad","minor-triad",       "augmented-triad",    "major-triad","major-triad","diminished-triad",   "diminished-triad"]
    };
    var scaleVals = scales[scale];
    var retVal = [];
    var rootID = ID;
    var scaleChords = diTri[scale];
    for(var i=0;i<scaleVals.length-1;i++){
        var chordType = scaleChords[i];
        rootID = rootID + scaleVals[i];
        retVal[i] = getChord(chordType,rootID);
    }
    return retVal;
}

function getRomanNumeral(number){
    var romNums = {
        1:"I",
        2:"II",
        3:"III",
        4:"IV",
        5:"V",
        6:"VI",
        7:"VII"
    };
    return rowNums[number];
}

function invertChord(numberOfTimes,chord){
    for(var i=0;i<numberOfTimes;i++){
        var oldBase = chord[0];
        var j=1;
        for(;j<chord.length;j++){
            chord[j-1] = chord[j];
        }
        oldBase.octave = oldBase.octave + 1;
        chord[j-1] = oldBase;
    }
    return chord;
}

function end(){
    jQuery("#scale-select").on("change",function(event){
        update(lastNoteID,jQuery("#scale-select").val());
    });

    WebMidi.enable(function(err) {

            if (err) console.log("WebMidi could not be enabled");

            //console.log(WebMidi.inputs);
            var midiInputs = WebMidi.inputs;
            for(var i=0;i<midiInputs.length;i++){

                var input = midiInputs[i];

                // Listening for a 'note on' message (on all channels)
                input.addListener('noteon', "all",
                    function(e){
                        //console.log(e);
                        note = e.note;
                        update(note.number,jQuery("#scale-select").val());
                    }
                );

            }

        }

    );
}

function update(ID,scale){
    console.log("Updating Data");
    console.log(scale);
    var scaleGUINames = {
        "major":    "Major",
        "n-minor":  "Natural Minor",
        "h-minor":  "Harmonic Minor",
        "m-minor":  "Melodic Minor"
    }
    lastNoteID = ID;
    var note = getNote(ID);
    console.log(note);
    jQuery("#adjustable_note_genericNote").text(note.note);
    jQuery("#adjustable_note_accidental").text(note.accidental);
    jQuery("#adjustable_note_octave").text(note.octave);
    jQuery("#adjustable_note_midiValue").text(note.ID);
    jQuery("#adjustable_note_frequency").text(note.frequency);
    jQuery("#adjustable_scale_scaleName").text(scaleGUINames[scale]);
    //jQuery("#adjustable_scale_keySignature")[0].text="");
    var scaleNotes = getScale(scale,ID);
    jQuery("#adjustable_scale_firstName").text(getScaleNoteName(scale,1));
    jQuery("#adjustable_scale_firstNote").text(getNoteString(scaleNotes[0].ID));
    jQuery("#adjustable_scale_secondName").text(getScaleNoteName(scale,2));
    jQuery("#adjustable_scale_secondNote").text(getNoteString(scaleNotes[1].ID));
    jQuery("#adjustable_scale_thirdName").text(getScaleNoteName(scale,3));
    jQuery("#adjustable_scale_thirdNote").text(getNoteString(scaleNotes[2].ID));
    jQuery("#adjustable_scale_forthName").text(getScaleNoteName(scale,4));
    jQuery("#adjustable_scale_forthNote").text(getNoteString(scaleNotes[3].ID));
    jQuery("#adjustable_scale_fifthName").text(getScaleNoteName(scale,5));
    jQuery("#adjustable_scale_fifthNote").text(getNoteString(scaleNotes[4].ID));
    jQuery("#adjustable_scale_sixthName").text(getScaleNoteName(scale,6));
    jQuery("#adjustable_scale_sixthNote").text(getNoteString(scaleNotes[5].ID));
    jQuery("#adjustable_scale_seventhName").text(getScaleNoteName(scale,7));
    jQuery("#adjustable_scale_seventhNote").text(getNoteString(scaleNotes[6].ID));
    jQuery("#adjustable_intervals_majorSecond").text(getNoteString(getInterval(ID,"major",2)));
    jQuery("#adjustable_intervals_majorThird").text(getNoteString(getInterval(ID,"major",3)));
    jQuery("#adjustable_intervals_majorSixth").text(getNoteString(getInterval(ID,"major",6)));
    jQuery("#adjustable_intervals_majorSeventh").text(getNoteString(getInterval(ID,"major",7)));
    jQuery("#adjustable_intervals_minorSecond").text(getNoteString(getInterval(ID,"minor",2)));
    jQuery("#adjustable_intervals_minorThird").text(getNoteString(getInterval(ID,"minor",3)));
    jQuery("#adjustable_intervals_minorSixth").text(getNoteString(getInterval(ID,"minor",6)));
    jQuery("#adjustable_intervals_minorSeventh").text(getNoteString(getInterval(ID,"minor",7)));
    jQuery("#adjustable_intervals_augmentedSecond").text(getNoteString(getInterval(ID,"augmented",2)));
    jQuery("#adjustable_intervals_augmentedThird").text(getNoteString(getInterval(ID,"augmented",3)));
    jQuery("#adjustable_intervals_augmentedForth").text(getNoteString(getInterval(ID,"augmented",4)));
    jQuery("#adjustable_intervals_augmentedFifth").text(getNoteString(getInterval(ID,"augmented",5)));
    jQuery("#adjustable_intervals_augmentedSixth").text(getNoteString(getInterval(ID,"augmented",6)));
    jQuery("#adjustable_intervals_augmentedSeventh").text(getNoteString(getInterval(ID,"augmented",7)));
    jQuery("#adjustable_intervals_diminishedSecond").text(getNoteString(getInterval(ID,"diminished",2)));
    jQuery("#adjustable_intervals_diminishedThird").text(getNoteString(getInterval(ID,"diminished",3)));
    jQuery("#adjustable_intervals_diminishedForth").text(getNoteString(getInterval(ID,"diminished",4)));
    jQuery("#adjustable_intervals_diminishedFifth").text(getNoteString(getInterval(ID,"diminished",5)));
    jQuery("#adjustable_intervals_diminishedSixth").text(getNoteString(getInterval(ID,"diminished",6)));
    jQuery("#adjustable_intervals_diminishedSeventh").text(getNoteString(getInterval(ID,"diminished",7)));
    jQuery("#adjustable_chords_majorTriad").text(getChordString("major-triad",ID));
    jQuery("#adjustable_chords_minorTriad").text(getChordString("minor-triad",ID));
    jQuery("#adjustable_chords_augmentedTriad").text(getChordString("augmented-triad",ID));
    jQuery("#adjustable_chords_diminishedTriad").text(getChordString("diminished-triad",ID));
    jQuery("#adjustable_chords_dominantSeventh").text(getChordString("dominant-seventh",ID));
    jQuery("#adjustable_chords_majorSeventh").text(getChordString("major-seventh",ID));
    jQuery("#adjustable_chords_minorSeventh").text(getChordString("minor-seventh",ID));
    jQuery("#adjustable_chords_halfDiminishedSeventh").text(getChordString("half-diminished-seventh",ID));
    jQuery("#adjustable_chords_diminishedSeventh").text(getChordString("diminished-seventh",ID));
    jQuery("#adjustable_chords_minorMajorSeventh").text(getChordString("minor-major-seventh",ID));
    jQuery("#adjustable_chords_augmentedMajorSeventh").text(getChordString("augmented-major-seventh",ID));
    jQuery("#adjustable_chords_augmentedSeventh").text(getChordString("augmented-seventh",ID));
    var dScale = getDiatonicTriads(ID,scale);
    jQuery("#adjustable_diatonicScale_firstChord").text(chord2String(dScale[0]));
    jQuery("#adjustable_diatonicScale_secondChord").text(chord2String(dScale[1]));
    jQuery("#adjustable_diatonicScale_thirdChord").text(chord2String(dScale[2]));
    jQuery("#adjustable_diatonicScale_forthChord").text(chord2String(dScale[3]));
    jQuery("#adjustable_diatonicScale_fifthChord").text(chord2String(dScale[4]));
    jQuery("#adjustable_diatonicScale_sixthChord").text(chord2String(dScale[5]));
    jQuery("#adjustable_diatonicScale_seventhChord").text(chord2String(dScale[6]));
}
