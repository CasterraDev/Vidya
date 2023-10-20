'use client'
import { useRef, useState, useEffect} from "react";
import styles from "../css/VideoPlayer.module.css";
import { RiFullscreenFill, RiFullscreenExitFill } from "react-icons/ri";
import { FaPlay, FaPause } from "react-icons/fa";
import PlayBackRate from "../components/PlayBackRate";
import VolumeControl from "../components/VolumeControl";
import ElapsedTimeTracker from "../components/ElapsedTimeTracker";
import { useSearchParams } from "next/navigation";

function VideoPlayer() {
    const autoPlay = false;
    const [muted, setMuted] = useState<boolean>(false);
    const [isFullscreen, setFullscreen] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
    const [volume, setVolume] = useState<number>(1);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [durationSec, setDurationSec] = useState<number>(1);
    const [elapsedSec, setElapsedSec] = useState<number>(1);

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const bufferRef = useRef<HTMLDivElement>(null);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const search = useSearchParams();
    const name = search?.get('vid');

    useEffect(() => {
       if (!videoRef.current) {
            return;
        }

        setDimensions({
            width: videoRef.current.width,
            height: videoRef.current.height
        })

        const onWaiting = () => {
            if (isPlaying) setIsPlaying(false);
            setIsWaiting(true);
        };

        const onPlay = () => {
            if (isWaiting) setIsWaiting(false);
            console.log("On Play")
            setIsPlaying(true);
        };

        const onPlaying = () => {
            onPlay();
        };

        const onPause = () => {
            setIsPlaying(false);
            setIsWaiting(false);
        };

        const element = videoRef.current;

        const onProgress = () => {
            if (!element.buffered) return;
            const bufferedEnd: any = element.buffered.end;
            const duration = element.duration;
            if (bufferRef && duration > 0 && bufferRef.current !== null) {
                bufferRef.current.style.width = (bufferedEnd / duration) * 100 + "%";
            }
        };

        const onTimeUpdate = () => {
            setIsWaiting(false);
            const duration = element.duration;
            setDurationSec(duration);
            setElapsedSec(element.currentTime);
            if (progressRef && duration > 0 && progressRef.current !== null) {
                progressRef.current.style.width =
                    (element.currentTime / duration) * 100 + "%";
            }
        };

        element.addEventListener("progress", onProgress);
        element.addEventListener("timeupdate", onTimeUpdate);

        element.addEventListener("waiting", onWaiting);
        element.addEventListener("play", onPlay);
        element.addEventListener("playing", onPlaying);
        element.addEventListener("pause", onPause);

        // clean up
        return () => {
            element.removeEventListener("waiting", onWaiting);
            element.removeEventListener("play", onPlay);
            element.removeEventListener("playing", onPlaying);
            element.removeEventListener("pause", onPause);
            element.removeEventListener("progress", onProgress);
            element.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [isPlaying, isWaiting]);

    useEffect(() => {
        if (!videoRef.current) return;
        if (videoRef.current.playbackRate === playbackRate) return;
        videoRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        if (!videoRef.current) return;
        if (muted) {
            if (videoRef.current.volume === 0) return;
            videoRef.current.volume = 0;
        } else {
            videoRef.current.volume = volume;
        }
    }, [muted, volume]);

    const handlePlayPauseClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                console.log("pausing");
                videoRef.current.pause();
            } else {
                console.log("Playing")
                videoRef.current.play();
            }
            console.log(isPlaying);
            setIsPlaying(!isPlaying);
        }
    };

    const seekToPosition = (pos: number) => {
        if (pos < 0 || pos > 1) return;

        if (videoRef.current !== null) {
            const durationMs = videoRef.current.duration * 1000 || 0;

            const newElapsedMs = durationMs * pos;
            const newTimeSec = newElapsedMs / 1000;
            console.log(durationMs, newElapsedMs, pos, newTimeSec);
            videoRef.current.currentTime = newTimeSec;
        }
    };

    const toggleFullscreen = () => {
        var vc = document.getElementById("videoContainer");
        var isInFullscreen = (document.fullscreenElement);

        if (!isInFullscreen) {
            if (vc !== null && vc.requestFullscreen) {
                vc.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const onFullScreenChange = () => {
            if (document.fullscreenElement !== null) {
                setFullscreen(true);
            } else {
                setFullscreen(false);
            }
        };

        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("mozfullscreenchange", onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange);
        document.addEventListener("msfullscreenchange", onFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullScreenChange);
            document.removeEventListener("mozfullscreenchange", onFullScreenChange);
            document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
            document.removeEventListener("msfullscreenchange", onFullScreenChange);
        };
    });

    //Autoplay hack
  //useEffect(() => {
  //    if (videoRef.current == null){
  //        return;
  //    }
  //    var promise = videoRef.current.play();
  //    videoRef.current.muted = muted;
  //    videoRef.current.volume = volume;
  //    if (promise !== undefined) {
  //        promise.then(_ => {
  //            // Autoplay started!
  //        }).catch(() => {
  //            // Autoplay not allowed!
  //            // Correct the isPlaying variable
  //            setIsPlaying(false)
  //        });
  //    }
  //});

    return (
        <>
            <div className={styles.container} id="videoContainer">
                {isWaiting && <div>Loading</div>}
                <video
                    className={styles.videoPlayer}
                    id="video"
                    src={`/api/getvideostream?videoId=${name}`}
                    onClick={handlePlayPauseClick}
                    ref={videoRef}
                    style={
                        (dimensions.width > dimensions.height) ? ({ width: "100%" }) : ({ height: "100%" })
                    }
                />
                <div className={styles.controlsContainer}>
                    <div className={styles.controls}>
                        <div
                            className={styles.progressBar}
                            onClick={(e) => {
                                const { left, width } =
                                    e.currentTarget.getBoundingClientRect();
                                const clickedPos = (e.clientX - left) / width;
                                seekToPosition(clickedPos);
                            }}>
                            <div className={styles.progressBarColors}>
                                <div
                                    className={styles.playProgress}
                                    ref={progressRef}
                                />

                                <div
                                    className={styles.bufferProgress}
                                    ref={bufferRef}
                                />
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.buttonsLeft}>
                                <div className={styles.playBtnContainer}>
                                    <button
                                        className={styles.playBtn}
                                        onClick={handlePlayPauseClick}>
                                        {isPlaying ? (
                                            <FaPause color="white" />
                                        ) : (
                                            <FaPlay color="white" />
                                        )}
                                    </button>
                                </div>
                                <ElapsedTimeTracker elapsedSec={elapsedSec} />
                                <VolumeControl
                                    setMuted={setMuted}
                                    muted={muted}
                                    volume={volume}
                                    setVolume={setVolume}
                                />
                            </div>
                            <div className={styles.buttonsRight}>
                                <PlayBackRate
                                    playbackRate={playbackRate}
                                    setPlaybackRate={setPlaybackRate}
                                />
                                <button
                                    title="Fullscreen"
                                    className={styles.fullscreen}
                                    onClick={toggleFullscreen}>
                                    {isFullscreen ? (
                                        <RiFullscreenExitFill color="white" />
                                    ) : (
                                        <RiFullscreenFill color="white" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoPlayer;

