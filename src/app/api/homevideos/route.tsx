import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse){
    var f = fs.readdirSync("src/videos");
    console.log(f);
    const data = {
        filenames: f.map((str, index) => ({id: index, filename: str}))
    }
    return NextResponse.json({data});
}
