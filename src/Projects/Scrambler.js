import './Scrambler.css';
import { useState, useEffect } from 'react';
import Prompt from './Components/Prompt';
import Inputs from './Components/Inputs';

function Scrambler({handleComplete}) {

  const [sentence, setSentence] = useState('Adam Haviv');
  const [sentenceShuffled, setShuffled] = useState('');

  const getSentence = async () => {
        setShuffled("Amda Hvaiv");
      };

  useEffect(() => {
    getSentence();
    document.getElementById('0').focus();
    document.getElementById('0').disabled = false;
  }, 
  [])
;

  const completeLevel = () =>{
    handleComplete();
  };
  
  return (
      <div className = "Scrambler-App">
        <div className="Container" id = 'gameContainer'>
          <Prompt sentenceShuffled = {sentenceShuffled} />
          <div className="Letters">
            <Inputs sentence={sentence} completeLevel={completeLevel} />
          </div>
        </div>
      </div>
      )};

export default Scrambler;
