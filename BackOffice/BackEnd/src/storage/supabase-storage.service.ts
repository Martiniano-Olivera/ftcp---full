import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private client: SupabaseClient;
  private bucket: string;
  private isPublic?: boolean;

  constructor() {
    const url = process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.bucket = process.env.SUPABASE_BUCKET || 'orders';
    this.client = createClient(url, key);
  }

  private async ensureBucketInfo() {
    if (this.isPublic === undefined) {
      const { data } = await this.client.storage.getBucket(this.bucket);
      this.isPublic = data?.public ?? false;
    }
  }

  async uploadFile(buffer: Buffer, filename: string, contentType: string) {
    await this.ensureBucketInfo();
    const date = new Date();
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const path = `orders/${month}/${randomUUID()}-${filename}`;
    await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, { contentType });
    return path;
  }

  getPublicUrl(path: string) {
    return this.client.storage.from(this.bucket).getPublicUrl(path).data.publicUrl;
  }

  async createSignedUrl(path: string, expiresIn: number) {
    const { data } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    return data?.signedUrl;
  }

  async isPublicBucket() {
    await this.ensureBucketInfo();
    return this.isPublic as boolean;
  }
}
