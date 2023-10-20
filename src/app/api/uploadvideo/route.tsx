import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest){
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file){
        return NextResponse.json({success: false});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //Do what you want

    const path = join('src/', 'videos', file.name);
    await writeFile(path, buffer);
    console.log("Open ${path} to see your file");
    return NextResponse.json({success:true});
}
