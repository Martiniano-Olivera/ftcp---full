import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.bucket = process.env.SUPABASE_BUCKET || 'orders';
    this.client = createClient(url, serviceKey);
  }

  async ensureBucket(bucket = this.bucket): Promise<void> {
    try {
      const { data, error } = await this.client.storage.getBucket(bucket);
      if (!data || error) {
        const { error: createError } = await this.client.storage.createBucket(
          bucket,
          { public: true },
        );
        if (createError) throw createError;
      }
    } catch (err) {
      this.logger.error(`Error ensuring bucket ${bucket}`, err as any);
      throw err;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = this.bucket,
  ): Promise<{ url: string }> {
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .upload(path, file.buffer, {
          contentType: file.mimetype,
        });
      if (error) throw error;
      const { data } = this.client.storage.from(bucket).getPublicUrl(path);
      return { url: data.publicUrl };
    } catch (err) {
      this.logger.error(`Error uploading file to ${path}`, err as any);
      throw err;
    }
  }
}
