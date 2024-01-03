import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, of } from 'rxjs';
import { PersonalizedOffersResponse } from './interfaces/personalized-offers-response.interface';
import { OffersRepository } from './offers.repository';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class OffersService {
  constructor(
    private repository: OffersRepository,
    private readonly httpService: HttpService,
    @InjectPinoLogger(OffersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getOffers(lineNumber: string, market: string, isConvergent: boolean, sourceName: string): Promise<any[]> {
    const offers = await this.repository.getOffers(market, isConvergent, sourceName);

    const rules = offers.map((offer) => offer.ruleId).filter((ruleId) => ruleId);

    const rulesData = rules.length > 0 ? await this.resolveOffersByRules(rules, lineNumber, market, isConvergent) : {};

    return offers
      .filter((offer) => !offer.ruleId || rulesData[offer.ruleId])
      .sort((a, b) => a.segmentsConfig[market].position - b.segmentsConfig[market].position)
      .map((offer) => {
        if (offer.ruleId) {
          return {
            position: offer.segmentsConfig[market].position,
            type: offer.type,
            icon: offer.icon,
            title: rulesData[offer.ruleId].title ?? offer.title,
            description: rulesData[offer.ruleId].description ?? offer.description,
            action: {
              ...offer.action,
              redirect: rulesData[offer.ruleId].action?.redirect ?? offer.action.redirect,
            },
            market: market,
            isConvergent: offer.isConvergent,
            metrics: offer.metrics,
          };
        }
        return {
          position: offer.segmentsConfig[market].position,
          type: offer.type,
          icon: offer.icon,
          title: offer.title,
          description: offer.description,
          action: offer.action,
          market: market,
          isConvergent: offer.isConvergent,
          metrics: offer.metrics,
        };
      });
  }

  private async resolveOffersByRules(
    rules: string[],
    lineNumber: string,
    market: string,
    isConvergent: boolean,
  ): Promise<PersonalizedOffersResponse> {
    const response = this.httpService
      .post<PersonalizedOffersResponse>(`${process.env.AG_RULES_ENGINE_URL}/v1/personalized-offers`, {
        line_number: lineNumber,
        is_convergent: isConvergent,
        market,
        rules,
      })
      .pipe(
        catchError(() => {
          this.logger.error('Error al llamar a la regla en Rule-Engine');
          return of({ data: {} });
        }),
      );
    const { data } = await lastValueFrom(response);
    return data;
  }
}
