// import { Logger } from '@nestjs/common';
// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import * as socketIo from 'socket.io';

// // @WebSocketGateway(81, { transports: ['websocket'] })
// @WebSocketGateway()
// export class AppGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   private logger: Logger = new Logger('AudioToTextGateway');

//   @WebSocketServer()
//   server: socketIo.Server;

//   handleDisconnect(client: any) {
//     // throw new Error('Method not implemented.');
//   }
//   handleConnection(client: any, ...args: any[]) {
//     // throw new Error('Method not implemented.');
//   }
//   afterInit(server: any) {
//     this.logger.log(`${server} WORKS +++++++++++++++++`);
//   }
//   @SubscribeMessage('send_message')
//   handleMessage(client: any, payload: any): string {
//     console.log('socket send_message payload:', payload);
//     return 'Hello world!';
//   }
// }
