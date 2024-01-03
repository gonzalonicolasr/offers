import { Controller, Get, ParseBoolPipe, Query, UseInterceptors, Headers, Param } from '@nestjs/common';
import { ResponseMapperInterceptor } from './response-mapper.interceptor';
import { OffersService } from './offers.service';
import { NoContentResponseInterceptor } from './no-content-response.interceptor';
@Controller({
  path: 'items',
  version: '1',
})
@UseInterceptors(ResponseMapperInterceptor, NoContentResponseInterceptor)
export class ItemsController {
  constructor(private service: OffersService) {}

  @Get('prepago/:lineNumber')
  getPrepagoItems(
    @Param('lineNumber') lineNumber: string,
    @Query('is_convergent', ParseBoolPipe) isConvergent: boolean,
    @Headers('x-source-name') sourceName: string,
  ) {
    return this.service.getOffers(lineNumber, 'prepago', isConvergent, sourceName);
  }

  @Get('abono/:lineNumber')
  getAbonoItems(
    @Param('lineNumber') lineNumber: string,
    @Query('is_convergent', ParseBoolPipe) isConvergent: boolean,
    @Headers('x-source-name') sourceName: string,
  ) {
    return this.service.getOffers(lineNumber, 'abono', isConvergent, sourceName);
  }

  @Get('pospago/:lineNumber')
  getPospagoItems(
    @Param('lineNumber') lineNumber: string,
    @Query('is_convergent', ParseBoolPipe) isConvergent: boolean,
    @Headers('x-source-name') sourceName: string,
  ) {
    return this.service.getOffers(lineNumber, 'pospago', isConvergent, sourceName);
  }

  @Get('hogar/:suscriberId')
  getHogarItems(
    @Param('suscriberId') suscriberId: string,
    @Query('is_convergent', ParseBoolPipe) isConvergent: boolean,
    @Headers('x-source-name') sourceName: string,
  ) {
    return this.service.getOffers(suscriberId, 'hogar', isConvergent, sourceName);
  }
}
