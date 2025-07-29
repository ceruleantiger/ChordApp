/*
These functions handle parsing the chord-pro text format
*/

const chordsharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
const chordflat =['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']

let transposedByNSemitones = 0 //track transpose how many
let oriline = [] //after submit, it'll be original song

function parseChordProFormat(chordProLinesArray) {
  //parse the song lines with embedded
  //chord pro chords and add them to DOM
  console.log('parseChordProFormat::chordProLinesArray')
  console.dir(chordProLinesArray)

  //clear any newline or return characters as a precaution --might not be needed
  for (let i = 0; i < chordProLinesArray.length; i++) {
    chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm, "");
  }

  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''

  //let css_chord_class = 'chord'
  let colorclass
  if (transposedByNSemitones%12 == 0) {
    colorclass = 'chordori'
  } else {
    colorclass = 'chordtra'
  }

  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i]
    /*console.log('line:')
    console.dir(line)
    let htmlLineWithChords = ''
    let collecting_chord = false; //true whenever we are collection chord characters
    let current_chord = "";*/

    //learn regular expression in https://www.w3schools.com/jsref/jsref_obj_regexp.asp
    let title = line.match(/{title:(.+?)}/i)
    if (title) {
      let titlestyle = title[1]
      textDiv.innerHTML += `<h1>${titlestyle}</h1>`
      continue
    }
    

    let isReadingChord = false
    chordLine = ''
    lyricLine = ''
    let chordLength = 0 //length of chord symbol

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      let ch = line.charAt(charIndex)

      if (ch === '[') {
        isReadingChord = true
        if(chordLength > 0){
          //put a blank between tighly spaced chords
          chordLine += ' '
          chordLength ++
        }
        //chordLength = 0
      }

      if (ch === ']') {
        isReadingChord = false
      }

      if (!isReadingChord && ch != ']') {
        lyricLine = lyricLine + ch
        if (chordLength > 0) {
          chordLength-- //consume chord symbol char
        }
        else {
          chordLine += ' ' //pad chord line with blank
        }   
      }

      if (isReadingChord && ch != '[') {
        chordLine += ch
        chordLength++
      }
    }



    let chordhtml = `<span class="${colorclass}">${chordLine}</span>`
    let lyrichtml = `${lyricLine}`
    
    if(chordLine.trim() !== '') textDiv.innerHTML = textDiv.innerHTML + `<pre>${chordhtml}</pre>`
    if(lyricLine.trim() !== '') textDiv.innerHTML = textDiv.innerHTML + `<p>${lyrichtml}</p>`

    // pre saves spaces, p collapses multiple spaces into a single space
  }
}



function transposeChord(semitones) {
  if (song.songLines.length==0) {
    return
  }

  transposedByNSemitones += semitones

  let newSongLines = []
  for (let i = 0; i < oriline.length; i++) {
    let line = oriline[i]
    let newline = ''
    let j = 0

    while (j<line.length) {
      if (line[j] === '[') {
        let chord = ''
        j++
        while (j<line.length && line[j] != ']') {
          chord += line[j]
          j++
        }
        j++


        let tranchord = ''
        let partchord = chord.split('/')

        for (let parti = 0; parti < partchord.length; parti++) {
          // get chords by regular expression
          // letter from A to G, symbol # b, 1 or more these char
          let chordmatch = partchord[parti].match(/([A-G#b]+)(.*)/)
          if (chordmatch) {
            let note = chordmatch[1]
            let suffix = chordmatch[2]
            let sharpi = chordsharp.indexOf(note)
            let flati = chordflat.indexOf(note)

            //set newindex to an invalid thing
            if (sharpi != -1) {
              let newindex = (sharpi + transposedByNSemitones + 12) % 12
              tranchord += chordsharp[newindex]+suffix
            }
            else if (flati != -1) {
              let newindex = (flati + transposedByNSemitones + 12) % 12
              tranchord += chordflat[newindex]+suffix
            }
            else {
              tranchord += partchord[parti]
            }
            // if 2 parts, add / after note(1st part) before suffix(2nd part)
            if (parti < partchord.length-1) {
              tranchord += '/'
            }

          }
          else {
            tranchord += parts[parti]
          }
          

        }

        let colorclass
        if (transposedByNSemitones%12 == 0) {
          colorclass = 'chordori'
        } else {
          colorclass = 'chordtra'
        }
        newline +=`[${tranchord}]`   //`<span class="${colorclass}">${tranchord}</span>`
        //make chords with [] so parseChordProFormat() can recognize and change their styles
      }

      else {
        newline += line[j]
        j++
      }

    }

    newSongLines.push(newline)

  }

  song.songLines = newSongLines
  parseChordProFormat(song.songLines)
}


