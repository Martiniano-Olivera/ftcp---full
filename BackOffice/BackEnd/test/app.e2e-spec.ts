import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EmployeesService } from '../src/employees/employees.service';

describe('App E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const employeesService = app.get(EmployeesService);
    try {
      await employeesService.createEmployee({
        username: 'admin',
        password: 'admin123',
        fullName: 'Administrador',
        email: 'admin@example.com',
        isActive: true,
      });
    } catch (err) {
      // ignore if already exists
    }

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .expect(200);
    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('/employees (POST)', () => {
    const unique = Date.now();
    return request(app.getHttpServer())
      .post('/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: `user${unique}`,
        password: 'pass1234',
        fullName: 'Test User',
        email: `user${unique}@example.com`,
      })
      .expect(201);
  });

  it('/employees (GET)', () => {
    return request(app.getHttpServer())
      .get('/employees')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
