//KEY CODES
//should clean up these hard coded key codes
/*const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

const chordsharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
const chordflat =['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']

let transposedByNSemitones = 0 //track transpose how many
let oriline = [] //after submit, it'll be original song
*/

function handleTransposeUp() {
  transposeChord(1)
}

function handleTransposeDown() {
  transposeChord(-1)
}

function handleOriginalKey() {
  if (!song.songLines) {
    return
  }
  transposedByNSemitones=0
  song.songLines = oriline.slice() //reset to original song
  parseChordProFormat(song.songLines)
}

/*
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

            //if not invalid thing
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
        newline += `<span class="${colorclass}">${tranchord}</span>`

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
*/

function handleKeyDown(e) {

  //console.log("keydown code = " + e.which );
  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //console.log("key UP: " + e.which);
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    //do nothing for now
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit

    document.getElementById('userTextField').value = ''
  }

  e.stopPropagation()
  e.preventDefault()

}

function handleSubmitButton() {

  //get text from user text input field
  let userText = document.getElementById('userTextField').value
  //clear lines of text in textDiv
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''

  if (userText && userText !== '') {
    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    //clear the user text field
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       console.log("typeof: " + typeof this.responseText)
       console.dir(this.responseText)
       //we are expecting the response text to be a JSON string
       let responseObj = JSON.parse(this.responseText)
       console.dir(responseObj)

        words = [] //clear drag-able words array;
        if (responseObj.songLines) {
          song.songLines = responseObj.songLines

          oriline = responseObj.songLines.slice() //save original song when submit

          transposedByNSemitones = 0 //reset transpose to no-transpose
          parseChordProFormat(song.songLines)
        }

      }
    }
    xhttp.open("POST", "song") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)

  }

}
