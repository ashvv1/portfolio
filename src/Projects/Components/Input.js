import { useState } from 'react';

export default function Input({ bgColorOrig, letterIndex, sentence, validUp, validDown }) {

    const [valid, setValid] = useState(false);

    const checkKey = (key) => {
        let nextTarget = document.getElementById(parseInt(key.target.id) + 1);
        let prevTarget = document.getElementById(parseInt(key.target.id) - 1);
        let currentTarget = document.getElementById(key.target.id);

        //if key is letter or space
        if ((key.keyCode >= 65 && key.keyCode <= 90) || key.keyCode === 32) {
            setTimeout(() => {
                if (currentTarget.value.toLowerCase() === sentence[key.target.id].toLowerCase()) {
                    if (!valid) {
                        setValid(true);
                        validUp();
                    }
                } else {
                    if (valid) {
                        validDown();
                    }
                    setValid(false);
                }
            }, 10);

            setTimeout(() => {
                if (nextTarget) {
                    currentTarget.disabled = true;
                    nextTarget.disabled = false;
                    nextTarget.focus()

                } else {
                    if (valid) {
                        currentTarget.disabled = true;
                    }
                }
            }, 100)
            //if key is backspace
        } else if (key.keyCode === 8) {
            if (valid) {
                setValid(false);
                validDown();
            }
            if (prevTarget) {
                currentTarget.disabled = true;
                prevTarget.disabled = false;
                currentTarget.value = '';
                prevTarget.focus();
                prevTarget.value = '';
            };
        }
    };

    let currentBg = bgColorOrig
    let currentColor = 'white'

    if (!valid) {
        currentBg = bgColorOrig
        currentColor = 'black'
    } else {
        currentBg = 'rgba(211, 157, 10, 0.733)';
        currentColor = 'white'
    }

    return <input type='text' maxLength='1' id={letterIndex.toString()} style={{ backgroundColor: currentBg, color: currentColor }} onKeyDown={e => checkKey(e)} disabled></input>
}