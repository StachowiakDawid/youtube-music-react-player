import React, { FC, useState, MouseEvent, SyntheticEvent, useRef, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../hooks';
import {
    getAudioName, getAudioSrc, unselectItem, setAudioSrc, getSelectedItem
} from '../../slices/playerSlice';

interface PlayerComponentProps { }

const PlayerComponent: FC<PlayerComponentProps> = () => {
    const audioName = useAppSelector(getAudioName);
    const src = useAppSelector(getAudioSrc);
    const selectedItem = useAppSelector(getSelectedItem);
    const dispatch = useAppDispatch();
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const progressBarRef = useRef<HTMLDivElement>(null);;
    const audioElementRef = useRef<HTMLAudioElement>(null);
    const playButtonRef = useRef<HTMLDivElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { 
            if (selectedItem !== -1) {
                let wasPaused = audioElementRef.current?.paused;
                if (playerContainerRef.current?.classList.contains("d-none")) {
                    playerContainerRef.current?.classList.remove("d-none");
                    wasPaused = false;
                }
                audioElementRef.current?.pause();
                audioElementRef.current!.src = src;
                if (!wasPaused) {
                    audioElementRef.current?.addEventListener("canplay", function() {
                        audioElementRef.current?.play();
                    }, {once : true});
                } else {
                    setAudioProgress(0);
                }
            }
    }, [selectedItem, src]);

    const convertTime = (value: number): string => {
        let minutes = Math.floor(value / 60).toString().padStart(2, '0');
        let seconds = Math.floor(value % 60).toString().padStart(2, '0');
        if (minutes === "NaN" || seconds === "NaN") {
            return convertTime(audioDuration);
        }
        return minutes + ":" + seconds;
    }

    const togglePlay = () => {
        togglePlayButton();
        if (!audioElementRef.current?.paused) {
            audioElementRef.current?.pause();
        } else {
            audioElementRef.current?.play();
        }
    }

    const togglePlayButton = () => {
        if (playButtonRef.current?.classList.contains("bi-pause-fill")) {
            playButtonRef.current?.classList.remove("bi-pause-fill");
            playButtonRef.current?.classList.add("bi-play-fill");
        } else {
            playButtonRef.current?.classList.remove("bi-play-fill");
            playButtonRef.current?.classList.add("bi-pause-fill");
        }
    }

    const adjustProgressBar = (once: boolean): void => {
        if (!audioElementRef.current!.paused && !once) {
            setTimeout(() => {
                setAudioProgress(audioElementRef.current!.currentTime);
                adjustProgressBar(once);
            }, 100);
        }
    }

    const controlProgress = (event: MouseEvent): void => {
        let target = (event.target as HTMLElement);
        let percent = ((event.clientX - target.getBoundingClientRect().left) * 100 / target.offsetWidth);
        setAudioProgress(audioDuration * percent / 100);
        audioElementRef.current!.currentTime = audioDuration * percent / 100;
    }

    const whilePlaying = (event: SyntheticEvent): void => {
        adjustProgressBar(false);
    }

    const onCanPlay = (event: SyntheticEvent): void => {
        setAudioDuration(audioElementRef.current!.duration);
    }

    const onEnded = (event: SyntheticEvent): void => {
        togglePlayButton();
    }

    const closePlayer = (event: MouseEvent): void => {
        playButtonRef.current?.classList.remove("bi-play-fill");
        playButtonRef.current?.classList.add("bi-pause-fill");
        if (!audioElementRef.current?.paused) {
            audioElementRef.current?.pause();
        }
        audioElementRef.current!.currentTime = 0;
        setAudioProgress(0);
        dispatch(setAudioSrc(""));
        dispatch(unselectItem());
        playerContainerRef?.current?.classList.add("d-none");
    }

    return <div className={"container fixed-bottom d-none"} ref={playerContainerRef}>
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <span dangerouslySetInnerHTML={{ __html: audioName }}></span>
                        <i className="bi bi-x-square-fill ml-auto" onClick={closePlayer}></i>
                    </div>
                    <div className="card-body">
                        <audio onCanPlay={onCanPlay} onPlaying={whilePlaying} onEnded={onEnded} ref={audioElementRef}></audio>
                        <div className="d-flex align-items-center justify-content-between">
                            <i className="bi bi-pause-fill me-2" onClick={togglePlay} ref={playButtonRef}></i>
                            <div style={{ flex: 1, backgroundColor: "lightgray" }} onClick={controlProgress}>
                                <div
                                    style={{
                                        width: Math.min(10 / audioDuration * audioProgress * 10, 100) + "%",
                                        height: "24px", background: "#006B5A", transition: "width .1s linear"
                                    }} ref={progressBarRef}>
                                </div>
                            </div>
                            <div className="ms-2"> {convertTime(audioProgress)} / {convertTime(audioDuration)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default PlayerComponent;
