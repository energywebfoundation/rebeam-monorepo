// import { Injectable } from '@nestjs/common';
// import { IVersionDetail, ISession } from '@energyweb/ocn-bridge';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Location } from '../ocn/schemas/location.schema';
// import { Repository } from 'typeorm';

// @Injectable()
// /**
//  * Generic database wrapper used to set/get OCPI authentication tokens and
//  * endpoints used in OCPI requests (server and client)
//  */
// export class LocationDbService {
//   constructor(
//     @InjectRepository(Location)
//     private readonly sessionRepository: Repository<Location>
//   ) {}

//   async getLocations(): Promise<string> {
//     const found = await this.authRepository.findOne();
//     return found?.tokenB ?? '';
//   }

//   async setTokenB(tokenB: string): Promise<void> {
//     const bs64TokenB = Buffer.from(tokenB).toString('base64');
//     await this.updateAuth({ tokenB: bs64TokenB });
//     return;
//   }

//   async getTokenC(): Promise<string> {
//     const found = await this.authRepository.findOne();
//     return found?.tokenC ?? '';
//   }

//   async setTokenC(tokenC: string): Promise<void> {
//     const bs64TokenC = Buffer.from(tokenC).toString('base64');
//     await this.updateAuth({ tokenC: bs64TokenC });
//     return;
//   }

//   async saveEndpoints(versionDetail: IVersionDetail): Promise<void> {
//     await this.endpointRepository.insert(versionDetail.endpoints);
//     return;
//   }

//   async getEndpoint(
//     identifier: string,
//     role: 'SENDER' | 'RECEIVER'
//   ): Promise<string> {
//     const found = await this.endpointRepository.findOne({
//       identifier,
//       role,
//     });
//     return found?.url ?? '';
//   }

//   private async updateAuth(update: Partial<Auth>) {
//     const existent = await this.authRepository.findOne({ id: 0 });
//     if (existent) {
//       await this.authRepository.update({ id: 0 }, update);
//     } else {
//       await this.authRepository.insert(update);
//     }
//   }

//   async insertSession(
//     session: ISession & {
//       sessionId: string;
//     }
//   ) {
//     const existent = await this.sessionRepository.findOne({
//       id: session.id,
//     });
//     if (existent) {
//       // console.log(existent, "IT ExISTS")
//       await this.sessionRepository.update({ _id: existent._id }, session);
//       const sessionUpdated = await this.sessionRepository.findOne({
//         id: session.id,
//       });
//       console.log(sessionUpdated, 'THE SESSIOn UPDATED');
//     } else {
//       await this.sessionRepository.insert(session);
//     }
//   }

//   async getSession(sessionID: string) {
//     const sessionData = await this.sessionRepository.findOne({
//       sessionId: sessionID,
//     });
//     return sessionData;
//   }

//   async updateSession(id: number, session: ISession) {
//     await this.sessionRepository.update({ _id: id }, session);
//   }
// }
