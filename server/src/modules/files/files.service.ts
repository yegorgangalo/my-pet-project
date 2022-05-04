import { AWS } from '@mandruy/common/const';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private bucketS3: S3;

  constructor(private configService: ConfigService) {
    this.bucketS3 = new S3();
  }

  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueFileName = this.createUniqueFileName(file.originalname);
      const filePath = path.resolve(__dirname, '..', '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, uniqueFileName), file.buffer);
      return uniqueFileName;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'File is not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadFileToS3(file: Express.Multer.File, prevFileName: string) {
    try {
      const uploadResult = await this.bucketS3
        .upload({
          Bucket: this.configService.get(AWS.AWS_PUBLIC_BUCKET_NAME),
          Body: file.buffer,
          Key: this.createUniqueFileName(file.originalname),
        })
        .promise();

      this.removeFileFromS3(prevFileName);

      return uploadResult;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'File is not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  createUniqueFileName(originalFileName) {
    const fileName = originalFileName;
    const splitted = fileName.split('.');
    const extension = splitted.pop();
    const fileNameWithoutExtension = splitted.join();
    const uniqueFileName = `${fileNameWithoutExtension}-${uuidv4()}.${extension}`;
    return uniqueFileName;
  }

  async removeFileFromS3(fileName) {
    if (!fileName) {
      return;
    }

    const prevFileParams = {
      Bucket: this.configService.get(AWS.AWS_PUBLIC_BUCKET_NAME),
      Key: fileName,
    };

    const exists = await this.bucketS3
      .headObject(prevFileParams)
      .promise()
      .then(() => {
        console.log('File Found in S3');
        return true;
      })
      .catch(err => {
        console.log('File not Found ERROR : ' + err.code);
        return false;
      });

    if (exists) {
      await this.bucketS3
        .deleteObject(prevFileParams)
        .promise()
        .then(() => console.log('file deleted Successfully'))
        .catch(err =>
          console.log('ERROR in file Deleting : ' + JSON.stringify(err)),
        );
    }
  }
}
