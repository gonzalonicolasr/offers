import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { Test, TestingModule } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import { AppModule } from './app.module';
import { OffersRepository } from './offers.repository';
import { PinoLogger } from 'nestjs-pino';
import { mockear } from './mocker';

describe('Offers Repository', () => {
  let repository: OffersRepository;
  const dynamoDBClientMock = mockClient(DynamoDBClient);
  const loggerMock: jest.Mocked<PinoLogger> = mockear(PinoLogger);

  const MOCK_DATE_STRING = '2023-11-08T12:34:56.789Z';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DynamoDBClient)
      .useValue(dynamoDBClientMock)
      .overrideProvider(PinoLogger)
      .useValue(loggerMock)
      .compile();

    module.createNestApplication();

    repository = module.get<OffersRepository>(OffersRepository);
  });

  beforeEach(() => {
    dynamoDBClientMock.reset();
  });

  it('Debería consultar las ofertas de la DynamoDB', async () => {
    dynamoDBClientMock.on(ScanCommand).resolves({
      Items: [],
    });

    const dynamoClientSendSpy = jest.spyOn(dynamoDBClientMock, 'send');

    await repository.getOffers('prepago', true, 'ANDROID');

    expect(dynamoClientSendSpy).toBeCalled();
  });

  it('Debería consultar las ofertas de la DynamoDB filtrando para clientes no convergentes', async () => {
    const segment = 'abono';
    dynamoDBClientMock.on(ScanCommand).resolves({
      Items: [],
    });

    const mockDate = new Date(MOCK_DATE_STRING);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const dynamoClientSendSpy = jest.spyOn(dynamoDBClientMock, 'send');

    await repository.getOffers(segment, false, 'IOS');

    expect(dynamoClientSendSpy).toBeCalledWith(
      expect.objectContaining({
        clientCommand: expect.objectContaining({
          input: <ScanCommandInput>{
            TableName: 'ag-highlighted-offers',
            FilterExpression:
              'is_convergent = :isConvergent AND is_active = :isActive AND attribute_exists(segments_config.#segment) AND contains(channels, :channel) AND (attribute_not_exists(validity) OR attribute_not_exists(validity.#from) OR validity.#from = :empty OR attribute_not_exists(validity.#to) OR validity.#to = :empty OR :currentDate BETWEEN validity.#from AND validity.#to)',
            ExpressionAttributeNames: {
              '#segment': segment,
              '#from': 'from',
              '#to': 'to',
            },
            ExpressionAttributeValues: {
              ':isActive': true,
              ':isConvergent': false,
              ':empty': '',
              ':currentDate': MOCK_DATE_STRING,
              ':channel': 'IOS',
            },
          },
        }),
      }),
    );
  });

  it('Debería consultar las ofertas de la DynamoDB filtrando para clientes convergentes', async () => {
    const segment = 'abono';
    dynamoDBClientMock.on(ScanCommand).resolves({
      Items: [],
    });

    const dynamoClientSendSpy = jest.spyOn(dynamoDBClientMock, 'send');

    const mockDate = new Date(MOCK_DATE_STRING);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    await repository.getOffers(segment, true, 'ANDROID');

    expect(dynamoClientSendSpy).toBeCalledWith(
      expect.objectContaining({
        clientCommand: expect.objectContaining({
          input: <ScanCommandInput>{
            TableName: 'ag-highlighted-offers',
            FilterExpression:
              'is_active = :isActive AND attribute_exists(segments_config.#segment) AND contains(channels, :channel) AND (attribute_not_exists(validity) OR attribute_not_exists(validity.#from) OR validity.#from = :empty OR attribute_not_exists(validity.#to) OR validity.#to = :empty OR :currentDate BETWEEN validity.#from AND validity.#to)',
            ExpressionAttributeNames: {
              '#segment': segment,
              '#from': 'from',
              '#to': 'to',
            },
            ExpressionAttributeValues: {
              ':isActive': true,
              ':channel': 'ANDROID',
              ':empty': '',
              ':currentDate': MOCK_DATE_STRING,
            },
          },
        }),
      }),
    );
  });

  it('Debería consultar las ofertas de la DynamoDB', async () => {
    dynamoDBClientMock.on(ScanCommand).resolves({
      Items: undefined,
    });

    const response = await repository.getOffers('prepago', true, 'ANDROID');

    expect(response).toEqual([]);
  });

  it('Debería retornar un listado de ofertas de la DynamoDB', async () => {
    dynamoDBClientMock.on(ScanCommand).resolves({
      Items: [
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
          is_convergent: false,
          metrics: {
            flow: 'recharge',
          },
          rule_id: 'regla_revenue_2',
          segments_config: [
            {
              id: 'prepago',
              position: 1,
            },
            {
              id: 'abono',
              position: 3,
            },
          ],
          title: '¡Recargá ahora 600!',
          type: 'light_right',
          validity: {
            from: '',
            to: '',
          },
        },
      ],
    });

    const response = await repository.getOffers('prepago', true, 'ANDROID');

    expect(response).toEqual([
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
        isConvergent: false,
        metrics: {
          flow: 'recharge',
        },
        ruleId: 'regla_revenue_2',
        segmentsConfig: [
          {
            id: 'prepago',
            position: 1,
          },
          {
            id: 'abono',
            position: 3,
          },
        ],
        title: '¡Recargá ahora 600!',
        type: 'light_right',
        validity: {
          from: '',
          to: '',
        },
      },
    ]);
  });

  it('Deberia logguear errores cuando falla la consulta a la dynamodb', async () => {
    jest.spyOn(dynamoDBClientMock, 'send').mockImplementation(() => {
      throw new Error('Parametros requeridos invalidos');
    });
    const mockDate = new Date(MOCK_DATE_STRING);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    await repository.getOffers('prepago', true, 'ANDROID');
    expect(loggerMock.error).toBeCalledWith(
      {
        dynamodb: {
          filterExpressionValues: {
            ':isActive': true,
            ':channel': 'ANDROID',
            ':empty': '',
            ':currentDate': MOCK_DATE_STRING,
            ':segment': 'prepago',
          },
        },
      },
      'Error en la consulta de ofertas en la DynamoDB: Parametros requeridos invalidos',
    );
  });

  it('Deberia retornar vacio cuando falla la consulta a la dynamodb', async () => {
    jest.spyOn(dynamoDBClientMock, 'send').mockImplementation(() => {
      throw new Error('Error en la consulta a DynamoDB');
    });

    const response = await repository.getOffers('prepago', true, 'ANDROID');

    expect(response).toEqual([]);
  });
});
