import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express';

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
    const { data, error } = await this.client.storage.listBuckets();
    if (error) {
      this.logger.error('Error listing buckets', error);
      throw error;
    }
    const exists = data?.some(b => b.name === bucket);
    if (!exists) {
      const { error: createError } = await this.client.storage.createBucket(bucket, {
        public: true,
      });
      if (createError) {
        this.logger.error('Error creating bucket', createError);
        throw createError;
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = this.bucket,
  ): Promise<{ url: string }> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });
    if (error) {
      this.logger.error('Error uploading file', error);
      throw error;
    }
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }

  getPublicUrl(path: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async createSignedUrl(path: string, expiresIn: number): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    if (error) {
      this.logger.error('Error creating signed URL', error);
      throw error;
    }
    return data.signedUrl;
  }
}
