'use client'
import React from 'react'
import { useState } from 'react';

export default function Uploadvideo() {
    const [file, setFile] = useState<File>();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (!file) return;

        try{
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/uploadvideo', {
                method: 'POST',
                body: data
                });
            if (!res.ok) throw new Error(await res.text());
        } catch (e: any){
            console.error(e);
        }
    };

    return (
        <main>
            <form onSubmit={onSubmit}>
                <input
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <input type="submit" value="Upload" />
            </form>
        </main>
    )
}
