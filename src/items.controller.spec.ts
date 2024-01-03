import { ItemsController } from './items.controller';
import { mockear } from './mocker';
import { OffersService } from './offers.service';

describe('ItemsController', () => {
  let offersServiceMock: jest.Mocked<OffersService>;
  let controller: ItemsController;

  const IS_CONVERGENT = true;
  const LINE_NUMBER = '2324523112';

  beforeEach(() => {
    offersServiceMock = mockear(OffersService);

    controller = new ItemsController(offersServiceMock);
  });

  describe('Obtener ofertas para prepago', () => {
    it('Debería llamar al servicio Offers con los parámetros correspondientes', () => {
      controller.getPrepagoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(offersServiceMock.getOffers).toBeCalledWith(LINE_NUMBER, 'prepago', IS_CONVERGENT, 'ANDROID');
    });

    it('Debería retornar un conjunto de ofertas', async () => {
      offersServiceMock.getOffers.mockResolvedValue([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'prepago',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);

      const result = await controller.getPrepagoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(result).toEqual([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'prepago',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);
    });
  });

  describe('Obtener ofertas para abono', () => {
    it('Debería llamar al servicio Offers con los parámetros correspondientes', () => {
      controller.getAbonoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(offersServiceMock.getOffers).toBeCalledWith(LINE_NUMBER, 'abono', IS_CONVERGENT, 'ANDROID');
    });

    it('Debería retornar un conjunto de ofertas', async () => {
      offersServiceMock.getOffers.mockResolvedValue([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'abono',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);

      const result = await controller.getAbonoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(result).toEqual([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'abono',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);
    });
  });

  describe('Obtener ofertas para pospago', () => {
    it('Debería llamar al servicio Offers con los parámetros correspondientes', () => {
      controller.getPospagoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(offersServiceMock.getOffers).toBeCalledWith(LINE_NUMBER, 'pospago', IS_CONVERGENT, 'ANDROID');
    });

    it('Debería retornar un conjunto de ofertas', async () => {
      offersServiceMock.getOffers.mockResolvedValue([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'pospago',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);

      const result = await controller.getPospagoItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(result).toEqual([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'pospago',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);
    });
  });

  describe('Obtener ofertas para hogar', () => {
    it('Debería llamar al servicio Offers con los parámetros correspondientes', () => {
      controller.getHogarItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(offersServiceMock.getOffers).toBeCalledWith(LINE_NUMBER, 'hogar', IS_CONVERGENT, 'ANDROID');
    });

    it('Debería retornar un conjunto de ofertas', async () => {
      offersServiceMock.getOffers.mockResolvedValue([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'hogar',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);

      const result = await controller.getHogarItems(LINE_NUMBER, IS_CONVERGENT, 'ANDROID');

      expect(result).toEqual([
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
            flow: 'recargas',
          },
        },
        {
          position: 2,
          type: 'light_left',
          icon: 'https://agresources.personal.com.ar/payment-portal/assets/img/data-fiscal.png',
          title: '¡Recargá ahora 100!',
          description: '2 GB + WhatsApp por 30 días + 500 MB todas las noches',
          action: {
            type: 'deep_linking',
            redirect: '/recharge',
          },
          market: 'hogar',
          isConvergent: true,
          metrics: {
            flow: 'recargas',
          },
        },
      ]);
    });
  });
});
