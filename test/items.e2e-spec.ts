import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { mockear } from '../src/mocker';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  const dynamoDBClientMock = mockClient(DynamoDBClient);
  let httpServiceMock: jest.Mocked<HttpService>;

  const LINE_NUMBER = '2324664608';
  const SUSCRIBER_ID = '009264608';

  beforeEach(async () => {
    httpServiceMock = mockear(HttpService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DynamoDBClient)
      .useValue(dynamoDBClientMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .compile();

    dynamoDBClientMock.reset();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/items/prepago (GET)', () => {
    it('Deberia responder status.code 200', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [
          {
            id: 'Recarga de 800',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 1,
              },
              prepago: {
                position: 2,
              },
            },
            title: '¡Recargá ahora 800!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
          {
            id: 'Recarga de 600',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              prepago: {
                position: 1,
              },
            },
            title: '¡Recargá ahora 600!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
        ],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );
      return request(app.getHttpServer())
        .get(`/items/prepago/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(200)
        .expect({
          data: [
            {
              position: 1,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 600!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'prepago',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
            {
              position: 2,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 800!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'prepago',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
          ],
        });
    });

    it('Deberia responder status.code 204 cuando no devuelva ofertas', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/prepago/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(204);
    });

    it('Deberia responder badrequest (400) sin is_convergent', () => {
      return request(app.getHttpServer())
        .get(`/items/prepago/${LINE_NUMBER}`)
        .set({ 'x-source-name': 'ANDROID' })
        .expect(400);
    });
  });

  describe('/items/abono (GET)', () => {
    it('Deberia responder status.code 200', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [
          {
            id: 'Recarga de 800',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              prepago: {
                position: 2,
              },
            },
            title: '¡Recargá ahora 800!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
          {
            id: 'Recarga de 600',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 1,
              },
              prepago: {
                position: 1,
              },
            },
            title: '¡Recargá ahora 600!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
        ],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/abono/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(200)
        .expect({
          data: [
            {
              position: 1,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 600!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'abono',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
            {
              position: 2,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 800!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'abono',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
          ],
        });
    });

    it('Deberia responder badrequest (400) sin is_convergent', () => {
      return request(app.getHttpServer())
        .get(`/items/abono/${LINE_NUMBER}`)
        .set({ 'x-source-name': 'ANDROID' })
        .expect(400);
    });

    it('Deberia responder status.code 204 cuando no devuelva ofertas', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/abono/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(204);
    });
  });

  describe('/items/pospago (GET)', () => {
    it('Deberia responder status.code 200', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [
          {
            id: 'Recarga de 800',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              pospago: {
                position: 2,
              },
            },
            title: '¡Recargá ahora 800!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
          {
            id: 'Recarga de 600',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              pospago: {
                position: 1,
              },
            },
            title: '¡Recargá ahora 600!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
        ],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/pospago/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(200)
        .expect({
          data: [
            {
              position: 1,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 600!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'pospago',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
            {
              position: 2,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 800!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'pospago',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
          ],
        });
    });

    it('Deberia responder badrequest (400) sin is_convergent', () => {
      return request(app.getHttpServer())
        .get(`/items/pospago/${LINE_NUMBER}`)
        .set({ 'x-source-name': 'ANDROID' })
        .expect(400);
    });

    it('Deberia responder status.code 204 cuando no devuelva ofertas', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/pospago/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(204);
    });
  });

  describe('/items/hogar (GET)', () => {
    it('Deberia responder status.code 200', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [
          {
            id: 'Recarga de 800',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              hogar: {
                position: 2,
              },
            },
            title: '¡Recargá ahora 800!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
          {
            id: 'Recarga de 600',
            action: {
              redirect: '/recharge',
              type: 'deep_linking',
            },
            channels: ['ANDROID', 'IOS', 'WEB'],
            description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
            icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
            is_active: true,
            is_convergent: true,
            metrics: {
              flow: 'recharge',
            },
            rule_id: '',
            segments_config: {
              abono: {
                position: 2,
              },
              hogar: {
                position: 1,
              },
            },
            title: '¡Recargá ahora 600!',
            type: 'light_right',
            validity: {
              from: '',
              to: '',
            },
          },
        ],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/hogar/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(200)
        .expect({
          data: [
            {
              position: 1,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 600!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'hogar',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
            {
              position: 2,
              type: 'light_right',
              icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
              title: '¡Recargá ahora 800!',
              description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
              action: {
                type: 'deep_linking',
                redirect: '/recharge',
              },
              market: 'hogar',
              isConvergent: true,
              metrics: {
                flow: 'recharge',
              },
            },
          ],
        });
    });

    it('Deberia responder badrequest (400) sin is_convergent', () => {
      return request(app.getHttpServer())
        .get(`/items/hogar/${LINE_NUMBER}`)
        .set({ 'x-source-name': 'ANDROID' })
        .expect(400);
    });

    it('Deberia responder status.code 204 cuando no devuelva ofertas', () => {
      dynamoDBClientMock.on(ScanCommand).resolves({
        Items: [],
      });
      httpServiceMock.post.mockReturnValue(
        of(<AxiosResponse>{
          data: {},
        }),
      );

      return request(app.getHttpServer())
        .get(`/items/hogar/${LINE_NUMBER}`)
        .query({ is_convergent: true })
        .set({ 'x-source-name': 'ANDROID' })
        .expect(204);
    });
  });
});
