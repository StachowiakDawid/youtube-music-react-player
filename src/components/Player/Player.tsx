import axios from 'axios';
import React, { FC, useState, MouseEvent, useRef, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { unselectItem, getSelectedItem } from '../../slices/playerSlice';

interface PlayerComponentProps { }

const PlayerComponent: FC<PlayerComponentProps> = () => {
    const [audioName, setAudioName] = useState('');
    const selectedItem = useAppSelector(getSelectedItem);
    const dispatch = useAppDispatch();
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const audioElementRef = useRef<HTMLAudioElement>(null);
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [showPlayerContainer, setShowPlayerContainer] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);

    useEffect(() => {
        if (selectedItem === -1) return;
        setAudioName(selectedItem.snippet.title);
        setIsAudioLoading(true);
        const wasPaused = audioElementRef.current?.paused && showPlayerContainer;
        setShowPlayerContainer(true);
        audioElementRef.current?.pause();
        setProgressBarWidth(0);
        axios.get(`?id=${selectedItem.id.videoId}`).then((src) => {
            audioElementRef.current!.src = src.data;
            setIsAudioLoading(false);
        });
        if (!wasPaused) {
            audioElementRef.current?.addEventListener("canplay", function () {
                audioElementRef.current?.play();
            }, { once: true });
        } else {
            setAudioProgress(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

    const convertTime = (value: number): string => {
        const convert = (d: number) => Math.floor(d).toString().padStart(2, '0');
        const durationStr = `${convert(value / 60)}:${convert(value % 60)}`;
        return durationStr.includes('NaN') ? convertTime(audioDuration) : durationStr;
    }

    const togglePlay = () => {
        audioElementRef.current?.paused ? audioElementRef.current?.play() : audioElementRef.current?.pause();
    }

    const adjustProgressBar = (percent: number, once: boolean): void => {
        setProgressBarWidth(percent);
        if (audioElementRef.current!.paused || once) return;
        setTimeout(() => {
            setAudioProgress(audioElementRef.current!.currentTime);
            adjustProgressBar(getProgressBarWidth(), false);
        }, 100);
    }

    const getProgressBarWidth = (): number => {
        return Math.min((10 / audioElementRef.current!.duration) * audioElementRef.current!.currentTime * 10, 100);
    }

    const controlProgress = (event: MouseEvent): void => {
        const target = (event.currentTarget as HTMLElement);
        const percent = ((event.clientX - target.getBoundingClientRect().left) * 100 / target.offsetWidth);
        audioElementRef.current!.currentTime = audioElementRef.current!.duration * percent / 100;
        adjustProgressBar(percent, true);
    }

    const whilePlaying = (): void => {
        setIsAudioPlaying(true);
        const percent = Math.min((10 / audioElementRef.current!.duration) * audioElementRef.current!.currentTime * 10, 100);
        adjustProgressBar(percent, false);
    }

    const onCanPlay = (): void => {
        setAudioDuration(audioElementRef.current!.duration);
    }

    const audioIsNotPlaying = (): void => {
        setIsAudioPlaying(false);
    }

    const closePlayer = (): void => {
        audioElementRef.current?.pause();
        audioElementRef.current!.currentTime = 0;
        setAudioProgress(0);
        setProgressBarWidth(0);
        audioElementRef.current!.src = '';
        dispatch(unselectItem());
        setShowPlayerContainer(false);
    }

    return <div className={`container fixed-bottom ${showPlayerContainer ? "" : "d-none"}`}>
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <span dangerouslySetInnerHTML={{ __html: audioName }}></span>
                        <i className="bi bi-x-square-fill ml-auto" onClick={closePlayer}></i>
                    </div>
                    <div className="card-body">
                        <audio onCanPlay={onCanPlay} onPlaying={whilePlaying} onEnded={audioIsNotPlaying} onPause={audioIsNotPlaying} ref={audioElementRef}></audio>
                        <div className={`d-flex align-items-center justify-content-between ${isAudioLoading ? 'd-none' : ''}`}>
                            <i className={`bi me-2 ${isAudioPlaying ? "bi-pause-fill" : "bi-play-fill"}`} onClick={togglePlay}></i>
                            <div style={{ flex: 1, backgroundColor: "lightgray" }} onClick={controlProgress}>
                                <div
                                    style={{
                                        height: "24px", background: "#006B5A", transition: "width .1s linear", width: progressBarWidth + '%'
                                    }}>
                                </div>
                            </div>
                            <div className="ms-2"> {convertTime(audioProgress)} / {convertTime(audioDuration)}</div>
                        </div>
                        {isAudioLoading && <span>Ładowanie...</span>}
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default PlayerComponent;
