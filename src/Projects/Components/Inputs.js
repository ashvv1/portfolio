import Input from "./Input";

export default function Inputs({ sentence, checkKey, completeLevel }) {

    //number of valid inputs
    let numValid = 0;
    //index for .focus()
    let letterIndex = -1;

    let myWords = sentence.split(" ");
    
    for (let i = 0; i < myWords.length - 1; i++) {
        myWords[i] = myWords[i] + " ";
    }

    const validUp = () => {
        numValid++;
    
        if (numValid === sentence.length) {
            completeLevel();
        }
    }

    const validDown = () => {
        numValid--
    }

    return (
        myWords.map((word, w) => {
            return (
                <div key={w} className='row'>
                    {word.split("").map((letter, l) => {
                        letterIndex++
                        if (letter === " ") {
                            return (
                                <div className='input' key={l}>
                                    <Input bgColorOrig="grey" checkKey={checkKey} l={l} letterIndex={letterIndex} sentence={sentence} validUp={validUp} validDown={validDown} />
                                </div>
                            )
                        } else {
                            return (
                                <div className='input' key={l}>
                                    <Input bgColorOrig="#e1e1e1" checkKey={checkKey} l={l} letterIndex={letterIndex} sentence={sentence} validUp={validUp} validDown={validDown} />
                                </div>
                            )
                        }
                    })}
                </div>
            )
        }
        )
    );
}