import '../App.css';
import musics from '../data';
import { useEffect, useRef, useState } from 'react';
import { timer } from '../util/timer';
import { visualizer } from '../util/visualizer';

const Player = ({props: {musicNumber, setMusicNumber, setOpen}}) => {
    console.log("play")
    const [duration, setDuration] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [play, setPlay] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [volume, setVolume] = useState(50);
    const [repeat, setRepeat] = useState('repeat');

    const audioRef = useRef();
    const canvasRef = useRef();

    function handleLoadStart(e){
        setDuration(audioRef.current.duration);
        if(play) { audioRef.current.play() };
    }

    function handlePlayingAudio(){

        visualizer(audioRef.current, canvasRef.current, play);

        if(play){
            audioRef.current.pause();
            setPlay(false);
        }else{
            audioRef.current.play();
            setPlay(true);
        }
    }

    function handleTimeUpdate() {
        const currentTime = audioRef.current.currentTime;
        setCurrentTime(currentTime);
    }

    function changeCurrentTime(e){
        const currentTime = Number(e.target.value);
        audioRef.current.currentTime = currentTime;
        setCurrentTime(currentTime);
    }

    function handleNextPrev(n){
        setMusicNumber(value => {
            if(n > 0)
                return value + n > musics.length - 1 ? 0 : value + n;
            return value + n < 0 ? musics.length - 1 : value + n;
        })
    }

    function handleRepeat(){
        setRepeat(value => {
            switch (value){
                case 'repeat':
                    return 'repeat_one'
                case 'repeat_one':
                    return 'shuffle'
                default:
                    return 'repeat';
            }
        })
    }

    function handleShuffle(){
        const num = randomNumber();
        setMusicNumber(num);
    }

    function randomNumber(){
        const number = Math.floor(Math.random() * (musics.length - 1));
        if(number === musicNumber)
            return randomNumber();
        return number;
    }

    function EndedAudio(){
        switch (repeat) {
            case 'repeat_one':
                return audioRef.current.play();
            case 'shuffle':
                return handleShuffle();
            default:
                return handleNextPrev(1);
        }
    }

    useEffect(()=> {
        audioRef.current.volume = volume / 100;
    },[volume]);

    return (
        <div className="player">
            <div className="nav">
                <i className="material-icons">expand_more</i>
                <span>Now Playing {musicNumber + 1}/{musics.length}</span>
                <i className="material-icons" onClick={() => setOpen(prev => !prev)}>queue_music</i>
            </div>
            <div className="img">
                <img 
                    src={musics[musicNumber].thumbnail} 
                    alt={musics[musicNumber].title}
                    className={`${play ? 'playing' : ''}`} 
                />
                <canvas ref={canvasRef} />
            </div>
            <div className="details">
                <p className="title">{musics[musicNumber].title}</p>
                <p className="artist">{musics[musicNumber].artist}</p>
            </div>
            <div className="progress">
                <input 
                    type="range" 
                    min={0} 
                    max={duration} 
                    value={currentTime} 
                    onChange={e => changeCurrentTime(e)}
                    style={{
                        background: `linear-gradient(to right, #3264fe ${currentTime/duration*100}%,#e5e5e5 ${currentTime/duration*100}%)`
                    }} 
                />
            </div>
            <div className="timer">
                <span>{timer(currentTime)}</span>
                <span>{timer(duration)}</span>
            </div>
            <div className="controls">
                <i className="material-icons" onClick={handleRepeat}>{repeat}</i>
                <i className="material-icons" id="prev" onClick={() => handleNextPrev(-1)}>skip_previous</i>
                <div className="play" onClick={handlePlayingAudio}>
                    <i className="material-icons">{play ? 'pause' : 'play_arrow'}</i>
                </div>
                <i className="material-icons" id="next" onClick={() => handleNextPrev(1)}>skip_next</i>

                <i className="material-icons" onClick={() => setShowVolume(prev => !prev)}>volume_up</i>

                <div className={`volume ${showVolume ? 'show' : ''}`}>
                    <i className="material-icons" onClick={() => setVolume(v => v > 0 ? 0 : 100)}>{volume === 0 ? 'volume_off' : 'volume_up'}</i>
                    <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={volume} 
                        onChange={e => setVolume(Number(e.target.value))} 
                        style={{
                            background: `linear-gradient(to right, #3264fe ${volume}%,#e5e5e5 ${volume}%)`
                        }} 
                    />
                    <span>{volume}</span>
                </div>

            </div>
            <audio src={musics[musicNumber].src} hidden  ref={audioRef}
                onLoadedData={handleLoadStart}
                onTimeUpdate={handleTimeUpdate}
                onEnded={EndedAudio}
            />
        </div>
    )
}

export default Player;