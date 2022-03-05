import { Providers } from '../types/symbols';
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Parser }  from 'json2csv';
import fs from 'fs';
import { promisify } from 'util';
import * as papaparse from "papaparse";
import {
    IBridge, IOcpiParty
} from '@energyweb/ocn-bridge';
import { SessionDbService } from './session-db.service';
import { JsonRpcProvider } from 'ethers/providers';

@Injectable()
export class SessionService {
    constructor(@Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
        private readonly config: ConfigService,
        private readonly sessionDbService: SessionDbService) {
    }

async getSessionFile(startDate: Date, endDate: Date) {
    const allSessions = await this.sessionDbService.getSessionsByDates(startDate, endDate);
    console.log(allSessions, "SESSIONS RETURNed")
    if (allSessions.length) {
       const csv = papaparse.unparse(allSessions, {
           header: true
       })
        // const csvParser = new Parser();
        // const csv = csvParser.parse(allSessions);
        console.log(csv, "THE CSV");
        const path = '/files'
        const fileName = `newFile.csv`;
        fs.mkdirSync(path);
        const writeFile = promisify(fs.writeFile)
        const fileWritte =  writeFile(`${path}/${fileName}`, csv, 'utf8')
        return fileName
    }
} 
async getExportedUserCSV(filename: string): Promise<string> {
    const filePath = `storage/app/exports/users/${filename}`;

    // if (!checkIfFileOrDirectoryExists(filePath)) {
    //   throw new NotFoundException('Users export not found.');
    // }
    const readFileFn = promisify(fs.readFile);

  const file =  await readFileFn(path, encoding) : readFile(path, {});

    return (await getFile(filePath, 'utf8')).toString();
  }

}

//https://medium.com/the-crowdlinker-chronicle/creating-writing-downloading-files-in-nestjs-ee3e26f2f726