import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.client = createClient(url, serviceKey);
  }

  /**
   * Ensure a bucket exists and is public. Idempotent.
   */
  async ensureBucket(bucket = 'orders'): Promise<void> {
    const { data: buckets, error } = await this.client.storage.listBuckets();
    if (error) {
      this.logger.error('Error listing buckets', error);
      throw error;
    }
    const exists = buckets?.some((b) => b.name === bucket);
    if (!exists) {
      const { error: createError } = await this.client.storage.createBucket(
        bucket,
        { public: true },
      );
      if (createError) {
        this.logger.error('Error creating bucket', createError);
        throw createError;
      }
    } else {
      // Ensure bucket is public
      const { error: updateError } = await this.client.storage.updateBucket(
        bucket,
        { public: true },
      );
      if (updateError) {
        this.logger.error('Error updating bucket', updateError);
        throw updateError;
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = 'orders',
  ): Promise<{ url: string }> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    if (error) {
      this.logger.error('Error uploading file', error);
      throw error;
    }
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }
}

