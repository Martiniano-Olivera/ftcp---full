import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

@Injectable()
export class SupabaseStorageService {
  private client: SupabaseClient;
  private bucket: string;
  public isPublicBucket = false;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.bucket = process.env.SUPABASE_BUCKET || 'orders';

    this.client = createClient(url, key);

    // determine if bucket is public
    this.client.storage
      .getBucket(this.bucket)
      .then(({ data }) => {
        this.isPublicBucket = data?.public ?? false;
      })
      .catch(() => {
        this.isPublicBucket = false;
      });
  }

  async uploadFile(buffer: Buffer, filename: string, contentType: string): Promise<string> {
    const now = new Date();
    const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const unique = crypto.randomUUID();
    const path = `orders/${folder}/${unique}-${filename}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, { contentType });
    if (error) {
      throw error;
    }
    return path;
  }

  getPublicUrl(path: string): string {
    return this.client.storage.from(this.bucket).getPublicUrl(path).data.publicUrl;
  }

  async createSignedUrl(path: string, expiresIn: number): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    if (error) {
      throw error;
    }
    return data.signedUrl;
  }
}
