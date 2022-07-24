import axios from 'axios';
import React, { FC, useState, MouseEvent, SyntheticEvent, useRef, useEffect } from 'react';
import { BACKEND_URL } from '../../constants';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { unselectItem, getSelectedItem } from '../../slices/playerSlice';

interface PlayerComponentProps { }

const PlayerComponent: FC<PlayerComponentProps> = () => {
    const [audioName, setAudioName] = useState('');
    const selectedItem = useAppSelector(getSelectedItem);
    const dispatch = useAppDispatch();
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const progressBarRef = useRef<HTMLDivElement>(null);;
    const audioElementRef = useRef<HTMLAudioElement>(null);
    const playButtonRef = useRef<HTMLDivElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [showPlayerContainer, setShowPlayerContainer] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);

    useEffect(() => {
        if (selectedItem !== -1) {
            setAudioName(selectedItem.snippet.title);
            setIsAudioLoading(true);
            let wasPaused = audioElementRef.current?.paused;
            if (!showPlayerContainer) {
                setShowPlayerContainer(true);
                wasPaused = false;
            }
            audioElementRef.current?.pause();
            getAudioUrl(selectedItem.id.videoId).then((src) => {
                audioElementRef.current!.src = src;
                setIsAudioLoading(false);
            });
            if (!wasPaused) {
                audioElementRef.current?.addEventListener("canplay", function () {
                    audioElementRef.current?.play();
                }, { once: true });
            } else {
                setAudioProgress(0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

    const getAudioUrl = async (id: string): Promise<string> => {
        let url = '';
        await axios.get(`${BACKEND_URL}?id=${id}`).then((response) => {
            url = response.data;
        })
        return url;
    };

    const convertTime = (value: number): string => {
        let minutes = Math.floor(value / 60).toString().padStart(2, '0');
        let seconds = Math.floor(value % 60).toString().padStart(2, '0');
        if (minutes === "NaN" || seconds === "NaN") {
            return convertTime(audioDuration);
        }
        return minutes + ":" + seconds;
    }

    const togglePlay = () => {
        audioElementRef.current?.paused ? audioElementRef.current?.play() : audioElementRef.current?.pause();
    }

    const adjustProgressBar = (percent: number, once: boolean): void => {
        progressBarRef.current!.style.width = percent + "%";
        if (!audioElementRef.current!.paused && !once) {
            setTimeout(() => {
                const newPercent = Math.min((10 / audioElementRef.current!.duration) * audioElementRef.current!.currentTime * 10, 100);
                setAudioProgress(audioElementRef.current!.currentTime);
                adjustProgressBar(newPercent, once);
            }, 100);
        }
    }

    const controlProgress = (event: MouseEvent): void => {
        let target = (event.currentTarget as HTMLElement);
        let percent = ((event.clientX - target.getBoundingClientRect().left) * 100 / target.offsetWidth);
        audioElementRef.current!.currentTime = audioElementRef.current!.duration * percent / 100;
        adjustProgressBar(percent, true);
    }

    const whilePlaying = (event: SyntheticEvent): void => {
        setIsAudioPlaying(true);
        const percent = Math.min((10 / audioElementRef.current!.duration) * audioElementRef.current!.currentTime * 10, 100);
        adjustProgressBar(percent, false);
    }

    const onCanPlay = (event: SyntheticEvent): void => {
        setAudioDuration(audioElementRef.current!.duration);
    }

    const onEnded = (event: SyntheticEvent): void => {
        setIsAudioPlaying(false);
    }

    const onPause = (event: SyntheticEvent): void => {
        setIsAudioPlaying(false);
    }

    const closePlayer = (event: MouseEvent): void => {
        audioElementRef.current?.pause();
        audioElementRef.current!.currentTime = 0;
        setAudioProgress(0);
        audioElementRef.current!.src = '';
        dispatch(unselectItem());
        setShowPlayerContainer(false);
    }

    return <div className={`container fixed-bottom ${showPlayerContainer ? "" : "d-none"}`} ref={playerContainerRef}>
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <span dangerouslySetInnerHTML={{ __html: audioName }}></span>
                        <i className="bi bi-x-square-fill ml-auto" onClick={closePlayer}></i>
                    </div>
                    <div className="card-body">
                        <audio onCanPlay={onCanPlay} onPlaying={whilePlaying} onEnded={onEnded} onPause={onPause} ref={audioElementRef}></audio>
                        <div className={`d-flex align-items-center justify-content-between ${isAudioLoading ? 'd-none' : ''}`}>
                            <i className={`bi me-2 ${isAudioPlaying ? "bi-pause-fill" : "bi-play-fill"}`} onClick={togglePlay} ref={playButtonRef}></i>
                            <div style={{ flex: 1, backgroundColor: "lightgray" }} onClick={controlProgress}>
                                <div
                                    style={{
                                        height: "24px", background: "#006B5A", transition: "width .1s linear"
                                    }} ref={progressBarRef}>
                                </div>
                            </div>
                            <div className="ms-2"> {convertTime(audioProgress)} / {convertTime(audioDuration)}</div>
                        </div>
                        <span className={`${!isAudioLoading ? 'd-none' : ''}`}>Ładowanie...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default PlayerComponent;
