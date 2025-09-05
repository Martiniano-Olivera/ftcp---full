import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.bucket = process.env.SUPABASE_BUCKET || 'orders';
    this.client = createClient(url, serviceKey);
  }

  async uploadFile(
    buffer: Buffer,
    path: string,
    contentType: string,
  ): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, { contentType });
    if (error) {
      throw error;
    }
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
      throw error;
    }
    return data.signedUrl;
  }
}
