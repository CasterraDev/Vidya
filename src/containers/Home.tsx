'use client'
import React, { useEffect, useState } from "react";
import styles from "../css/Home.module.css"
import Link from "next/link";

async function grabAllFiles(setFileData: any) {
    var files;
    try {
        files = await fetch("/api/homeVideos", { method: "GET" });
    } catch (e) {
        console.log(e);
    } finally {
        if (files){
            var f = await files.json();
            setFileData(f);
        }
    }
}

export default function Home() {
    const [fileData, setFileData] = useState<any>(null);

    useEffect(() => {
        grabAllFiles(setFileData);
    }, []);

    return (
        <>
            {fileData !== null && console.log("FILE: " + fileData)}
            <div className={styles.videoTitle}>Videos</div>
            <div className={styles.videoGrid}>
                {fileData !== null &&
                    fileData.data.filenames.map((item: any) => (
                        <div className={styles.videoCard} key={item}>
                            <Link key={item.id} href={`watch?vid=${item.filename}`}>{item.filename}</Link>
                        </div>
                    ))}
            </div>
        </>
    );
}

