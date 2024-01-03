import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { OfferDynamoDB } from './offers.model';

@Injectable()
export class OffersRepository {
  private readonly getOffersBaseFilterExpression = this.buildBaseFilterExpression();

  constructor(
    private readonly dynamoDBClient: DynamoDBClient,
    @InjectPinoLogger(OffersRepository.name)
    private readonly logger: PinoLogger,
  ) {}

  async getOffers(segment: string, isConvergent: boolean, sourceName: string): Promise<OfferDynamoDB[]> {
    const filterExpression = this.buildFilterExpression(isConvergent);
    const filterExpressionValues = this.buildFilterExpressionValues(isConvergent, sourceName);

    const scanCommandInput: ScanCommandInput = {
      TableName: 'ag-highlighted-offers',
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#segment': segment,
        '#from': 'from',
        '#to': 'to',
      },
      ExpressionAttributeValues: filterExpressionValues,
    };
    try {
      const { Items } = await this.dynamoDBClient.send(new ScanCommand(scanCommandInput));

      if (Items) {
        return Items.map((item) => OfferDynamoDB.fromDynamoDBItem(item));
      }

      return [];
    } catch (error) {
      this.logger.error(
        {
          dynamodb: {
            filterExpressionValues: {
              ...filterExpressionValues,
              ':segment': 'prepago',
            },
          },
        },
        `Error en la consulta de ofertas en la DynamoDB: ${error.message}`,
      );
      return [];
    }
  }

  private buildBaseFilterExpression(): string {
    const baseFilters = [
      'is_active = :isActive',
      'attribute_exists(segments_config.#segment)',
      'contains(channels, :channel)',
    ];

    const validityFilters = [
      'attribute_not_exists(validity)',
      'attribute_not_exists(validity.#from) OR validity.#from = :empty',
      'attribute_not_exists(validity.#to) OR validity.#to = :empty',
      ':currentDate BETWEEN validity.#from AND validity.#to',
    ];

    const baseFilterExpression = baseFilters.join(' AND ');
    const validityFilterExpression = `(${validityFilters.join(' OR ')})`;

    return `${baseFilterExpression} AND ${validityFilterExpression}`;
  }

  private buildFilterExpression(isConvergent: boolean): string {
    if (!isConvergent) {
      return `is_convergent = :isConvergent AND ${this.getOffersBaseFilterExpression}`;
    }

    return this.getOffersBaseFilterExpression;
  }

  private buildFilterExpressionValues(isConvergent: boolean, sourceName: string): Record<string, any> {
    const expressionAttributeValues: Record<string, any> = {
      ':isActive': true,
      ':channel': sourceName,
      ':empty': '',
      ':currentDate': new Date().toISOString(),
    };

    if (!isConvergent) {
      expressionAttributeValues[':isConvergent'] = isConvergent;
    }

    return expressionAttributeValues;
  }
}
