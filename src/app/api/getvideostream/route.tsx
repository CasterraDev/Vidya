import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { ReadableOptions } from "stream";

const CHUNK_SIZE_IN_BYTES = 1000000; //1mb

function streamFile(path: string, options?: any): ReadableStream<Uint8Array> {
    const downloadStream = fs.createReadStream(path, options);

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
            downloadStream.on("end", () => controller.close());
            downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
        },
        cancel() {
            downloadStream.destroy();
        },
    });
}

export function GET(req: NextRequest, res: NextApiResponse) {
    let range = req.headers.get('range');
    console.log(req.url)
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    console.log(urlParams);
    if (!range) {
        return new Response('Error')
    }

    const videoId = urlParams.get('videoId');
    console.log(videoId)
    let videoPath = `src/videos/${videoId}`;
    //if (videoId.match(("\.[^\\]+)$") === null)){
    //    videoPath = `src/videos/${videoId}.mp4`
    //}
    console.log(videoPath);
    //TODO: Check that the file exists
    const videoSizeInBytes = fs.statSync(videoPath).size;

    const chunkStart = Number(range.replace(/\D/g, ""));

    const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, videoSizeInBytes - 1);

    const contentLength = chunkEnd - chunkStart + 1;

    const myHeaders = new Headers();
    myHeaders.append("Content-Range", `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`)
    myHeaders.append("Accept-Ranges", "bytes");
    myHeaders.append("Content-Length", contentLength.toString());
    myHeaders.append("Content-Type", "video/mp4");
    const data: ReadableStream = streamFile(videoPath, {start: chunkStart, end: chunkEnd});
    return new Response(data, {
        status: 206,
        headers: myHeaders,
        })
}
