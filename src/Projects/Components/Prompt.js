import Sentence from "./Sentence";



export default function Prompt({ sentenceShuffled, score, upLevel }) {

    return (
        <div>
            <Sentence sentenceShuffled={sentenceShuffled} />
           
            <p className='Score'>Score: {score}</p>
        </div>
    )
}