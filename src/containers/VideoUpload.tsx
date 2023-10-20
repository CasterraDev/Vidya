'use client'
import React, { useState } from "react";
import styles from "../css/VideoUpload.module.css"

export default function VideoUpload() {
	const [file, setFile] = useState(undefined);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit() {
		const data = new FormData();

		if (!file) return;

		setSubmitting(true);

		data.append("file", file);

		const config = {
			onUploadProgress: function (progressEvent: any) {
				const percentComplete = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				setProgress(percentComplete);
			},
		};
		console.log("DATA: ");
		console.log(data);
		try {
			await fetch("/api/videos", {
                method: "POST",
                body: data
            });
		} catch (e: any) {
			setError(e.message);
		} finally {
			setSubmitting(false);
			setProgress(0);
		}
	}

	function handleSetFile(event : any) {
		const files = event.target.files;

		if (files?.length) {
			console.log(files[0]);
			setFile(files[0]);
		}
	}

	return (
		<div className={styles.container}>
			{error && <p>{error}</p>}
			{submitting && <p>{progress}%</p>}
			<form className={styles.form} action="POST">
				<div>
					<label id={styles.fileText} htmlFor="file">File:</label>
					<input
						type="file"
						name="file"
						id={styles.file}
						accept=".mp4"
						onChange={handleSetFile}
					/>
				</div>
			</form>
			<button className={styles.uploadBtn} onClick={handleSubmit}>Upload Video</button>
		</div>
	);
}
