import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = file.originalname;
      const splitted = fileName.split('.');
      const extension = splitted.pop();
      const fileNameWithoutExtension = splitted.join();
      const uniqueName = `${fileNameWithoutExtension}-${uuidv4()}.${extension}`;

      const filePath = path.resolve(__dirname, '..', '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, uniqueName), file.buffer);

      return uniqueName;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'File is not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
