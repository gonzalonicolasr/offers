import { HttpService } from '@nestjs/axios';
import { mockear } from './mocker';
import { OffersRepository } from './offers.repository';
import { OffersService } from './offers.service';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { PinoLogger } from 'nestjs-pino';

describe('Offers Service', () => {
  let repositoryMock: jest.Mocked<OffersRepository>;
  let httpServiceMock: jest.Mocked<HttpService>;
  let loggerMock: jest.Mocked<PinoLogger>;
  let service: OffersService;

  beforeEach(() => {
    repositoryMock = mockear(OffersRepository);
    httpServiceMock = mockear(HttpService);
    loggerMock = mockear(PinoLogger);
    loggerMock.error = jest.fn();
    service = new OffersService(repositoryMock, httpServiceMock, loggerMock);
  });

  it('Debería llamar al Offers repository con los parámetros correspondientes', async () => {
    repositoryMock.getOffers.mockResolvedValue([]);
    httpServiceMock.post.mockReturnValue(
      of(<AxiosResponse>{
        data: {},
      }),
    );
    await service.getOffers('2324523112', 'prepago', true, 'ANDROID');
    expect(repositoryMock.getOffers).toBeCalledWith('prepago', true, 'ANDROID');
  });

  it('Debería responder una colección de ofertas', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de 600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
    ]);
    httpServiceMock.post.mockReturnValue(
      of(<AxiosResponse>{
        data: {},
      }),
    );
    const response = await service.getOffers('2324523112', 'prepago', true, 'ANDROID');

    expect(response).toEqual([
      {
        position: 1,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: '¡Recargá ahora 600!',
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
    ]);
  });

  it('Debería responder una colección de ofertas ordenas por position para cliente prepago', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de 700',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
          abono: {
            position: 2,
          },
          prepago: {
            position: 2,
          },
        },
        title: '¡Recargá ahora 700!',
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
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
      {
        id: 'Recarga de 800',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
          abono: {
            position: 2,
          },
          prepago: {
            position: 3,
          },
        },
        title: '¡Recargá ahora 800!',
        type: 'light_right',
        validity: {
          from: '',
          to: '',
        },
      },
    ]);

    httpServiceMock.post.mockReturnValue(
      of(<AxiosResponse>{
        data: {},
      }),
    );

    const response = await service.getOffers('2324523112', 'prepago', true, 'ANDROID');

    expect(response).toEqual([
      {
        position: 1,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: '¡Recargá ahora 600!',
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
      {
        position: 2,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: '¡Recargá ahora 700!',
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
      {
        position: 3,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: '¡Recargá ahora 800!',
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
    ]);
  });

  it('Debería llamar al servicio rules-engine para ejecutas las ofertas que tengan regla asociada', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de $600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: 'regla_revenue',
        segmentsConfig: {
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
      {
        id: 'Recarga de $700',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
    ]);
    httpServiceMock.post.mockReturnValue(
      of(<AxiosResponse>{
        data: {},
      }),
    );
    process.env.AG_RULES_ENGINE_URL = 'http://alb.agapi-test.personal.com.ar/rules-engine';
    await service.getOffers('2324523112', 'prepago', true, 'ANDROID');

    expect(httpServiceMock.post).toHaveBeenCalledWith(
      'http://alb.agapi-test.personal.com.ar/rules-engine/v1/personalized-offers',
      {
        line_number: '2324523112',
        market: 'prepago',
        is_convergent: true,
        rules: ['regla_revenue'],
      },
    );
  });

  it('Debería llamar al servicio rules-engine y decorar la respuesta con los datos del rules-engine', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de $600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: 'regla_revenue',
        segmentsConfig: {
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
      {
        id: 'Recarga de $700',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: 'rule-2',
        segmentsConfig: {
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
    ]);

    httpServiceMock.post.mockReturnValue(
      of(<AxiosResponse>{
        data: {
          regla_revenue: {
            id: 'regla_revenue',
            title: 'Recarga $1000',
            action: {
              redirect: '/recargas',
            },
            description: 'Test Recarga',
          },
        },
      }),
    );

    const actual = await service.getOffers('2324523112', 'prepago', true, 'ANDROID');

    expect(actual).toEqual([
      {
        position: 1,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: 'Recarga $1000',
        description: 'Test Recarga',
        action: {
          redirect: '/recargas',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
    ]);
  });

  it('Debería llamar al servicio rules-engine solo cuando haya ofertas con reglas asociadas', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de $600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
      {
        id: 'Recarga de $700',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
    ]);

    await service.getOffers('2324523112', 'prepago', true, 'ANDROID');

    expect(httpServiceMock.post).not.toHaveBeenCalled();
  });

  it('Debería Loguear la excepcion causada por el llamado a rules-engine', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de $600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: 'recharge',
        segmentsConfig: {
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
    ]);
    const error = new Error('Error al llamar al rule engine.');
    httpServiceMock.post.mockReturnValue(throwError(() => error));

    await service.getOffers('2324523112', 'prepago', true, 'ANDROID').then(() => {
      expect(loggerMock.error).toHaveBeenLastCalledWith('Error al llamar a la regla en Rule-Engine');
    });
  });
  it('Debería devolver un objeto vacio cuando falle completamente rules-engine', async () => {
    repositoryMock.getOffers.mockResolvedValue([
      {
        id: 'Recarga de $600',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: 'regla_revenue',
        segmentsConfig: {
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
      {
        id: 'Recarga de $700',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        channels: ['ANDROID', 'IOS', 'WEB'],
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        isActive: true,
        isConvergent: true,
        metrics: {
          flow: '',
        },
        ruleId: '',
        segmentsConfig: {
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
    ]);
    httpServiceMock.post.mockReturnValue(
      throwError(() => {
        return AxiosError.from(new Error('Rule-engine fallo completamente, se devuelve objeto vacio.'));
      }),
    );

    const actual = await service.getOffers('2324523112', 'prepago', true, 'ANDROID');
    expect(actual).toEqual([
      {
        position: 1,
        type: 'light_right',
        icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
        title: '¡Recargá ahora 600!',
        description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
        action: {
          redirect: '/recharge',
          type: 'deep_linking',
        },
        market: 'prepago',
        isConvergent: true,
        metrics: {
          flow: '',
        },
      },
    ]);
  });
});
