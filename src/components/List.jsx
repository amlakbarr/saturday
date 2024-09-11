import '../App.css';
import musics from '../data';
import { useState, useEffect } from 'react';
import { timer } from '../util/timer';

const List = ({props: {open, setOpen, musicNumber, setMusicNumber}}) => {
    return (
        <div className={`list ${open ? 'show' : ''}`}>
            <div className="header">
                <div>
                    <i className="material-icons">queue_music</i>
                    <span>Music list</span>
                </div>
                <i className="material-icons" onClick={() => setOpen(false)}>close</i>
            </div>
            <ul>
                {
                    musics.map((music, index)=>(
                        <li key={music.id} onClick={() => setMusicNumber(index)} className={`${musicNumber === index ? 'playing' : ''}`}>
                            <div className="row">
                                <span>{music.title}</span>
                                <p>{music.artist}</p>
                            </div>
                            <Duration music={music} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default List;

const Duration = ({music}) => {
    const [duration, setDuration] = useState(0);
    useEffect(()=> {
        const audio = new Audio(music.src)
        audio.onloadedmetadata = function(){
            if(audio.readyState > 0){
                setDuration(audio.duration)
            }
        }
    },[music])
    return (
        <span className='duration'>{timer(duration)}</span>
    )
}