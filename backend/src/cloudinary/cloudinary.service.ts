import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private cloudinary: typeof import('cloudinary').v2) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        { folder: 'imoveis', resource_type: 'auto' },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('O Cloudinary não retornou os dados do upload.'));
        },
      ).end(file.buffer);
    });
  }

  async deleteMedia(publicId: string, resourceType: string) {
    return this.cloudinary.uploader.destroy(publicId, { resource_type: resourceType as 'image' | 'video' | 'raw' });
  }
}
