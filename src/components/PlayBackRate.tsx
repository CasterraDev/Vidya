import React from "react";
import styles from "../css/PlayBackRate.module.css"

function click(){

}

export default function PlaybackRateControl({
    playbackRate,
    setPlaybackRate
}: {playbackRate:number, setPlaybackRate:any}) {
    return (
        <div className={styles.container}>
            <button>
                <div className={styles.playBackRateControl} onClick={click}>
                    <div className={`${styles.text} ${styles.speedBtn}`}>
                        <span style={{ fontSize: "14px" }}>{playbackRate}</span>
                        <span style={{ fontSize: "11px" }}>x</span>
                    </div>
                </div>
            </button>
            <div className={styles.menuList}>
                <div className={styles.menuGroup}>
                    {[.25, .50, .75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                        <div className={styles.menuItem}
                            key={`playbackRate_${rate}`}
                            onClick={() => {
                                if (playbackRate === rate) return;
                                setPlaybackRate(rate);
                            }}
                        >
                            <div className={styles.text} style={{ fontWeight: "600", color: "white" }}>
                                {rate}x
                            </div>
                            {playbackRate === rate && (
                                <div className={styles.arrow} style={{ width: "15px", height: "11px" }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};
