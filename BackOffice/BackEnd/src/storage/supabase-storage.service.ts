import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.client = createClient(url, serviceKey);
  }

  async ensureBucket(bucket = 'orders'): Promise<void> {
    try {
      const { data: existing } = await this.client.storage.getBucket(bucket);
      if (!existing) {
        await this.client.storage.createBucket(bucket, { public: true });
        this.logger.log(`Bucket ${bucket} creado`);
      } else if (!existing.public) {
        await this.client.storage.updateBucket(bucket, { public: true });
        this.logger.log(`Bucket ${bucket} actualizado a público`);
      }
    } catch (error) {
      this.logger.error('Error asegurando bucket', error as any);
      throw error;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = 'orders',
  ): Promise<{ url: string }> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });
    if (error) {
      this.logger.error('Error subiendo archivo', error);
      throw error;
    }
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }
}
