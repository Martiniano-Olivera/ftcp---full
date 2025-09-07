// src/storage/supabase-storage.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados',
      );
    }
    this.client = createClient(url, key); // service role para escribir en storage
  }

  async ensureBucket(bucket = 'orders') {
    const { data: buckets, error: listErr } =
      await this.client.storage.listBuckets();
    if (listErr) {
      // si falla listar, dejamos que el upload arroje error con mensaje claro
      return;
    }
    const exists = buckets?.some(b => b.name === bucket);
    if (!exists) {
      const { error: createErr } = await this.client.storage.createBucket(
        bucket,
        { public: true },
      );
      if (createErr) {
        throw new InternalServerErrorException(
          `No se pudo crear bucket: ${createErr.message}`,
        );
      }
    }
  }

  /**
   * Sube un archivo Multer a Supabase Storage y devuelve su URL pública.
   */
  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = 'orders',
  ): Promise<{ url: string }> {
    await this.ensureBucket(bucket);

    const { error: upErr } = await this.client.storage
      .from(bucket)
      .upload(path, file.buffer, {
        upsert: true,
        contentType: file.mimetype || 'application/pdf',
      });

    if (upErr) {
      throw new InternalServerErrorException(
        `Error subiendo archivo: ${upErr.message}`,
      );
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }
}
