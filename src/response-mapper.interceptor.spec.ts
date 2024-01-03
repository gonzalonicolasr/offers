import { lastValueFrom, of } from 'rxjs';
import { MobileResponseBody, ResponseMapperInterceptor } from './response-mapper.interceptor';
import { ExecutionContext } from '@nestjs/common';

describe('ResponseMapperInterceptor', () => {
  const interceptor = new ResponseMapperInterceptor();
  const createCallHandler = () => ({
    handle: () => of({ attr: 'some-value' }),
  });
  const createExecutionContext = (sourceName: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-source-name': sourceName },
        }),
      }),
    } as ExecutionContext;
  };

  it('debería devolver el response dentro del campo data cuando el source es ANDROID', async () => {
    const result = interceptor.intercept(createExecutionContext('ANDROID'), createCallHandler());
    expect(await lastValueFrom(result)).toEqual(<MobileResponseBody<any>>{
      data: { attr: 'some-value' },
    });
  });

  it('debería devolver el response dentro del campo data cuando el source es IOS', async () => {
    const result = interceptor.intercept(createExecutionContext('IOS'), createCallHandler());
    expect(await lastValueFrom(result)).toEqual(<MobileResponseBody<any>>{
      data: { attr: 'some-value' },
    });
  });

  it('no debería devolver el response dentro del campo data cuando el source es WEB', async () => {
    const result = interceptor.intercept(createExecutionContext('WEB'), createCallHandler());
    expect(await lastValueFrom(result)).toEqual({ attr: 'some-value' });
  });

  it('no debería devolver el response dentro del campo data cuando el source es cualquier cosa', async () => {
    const result = interceptor.intercept(createExecutionContext('cualquier-cosa'), createCallHandler());
    expect(await lastValueFrom(result)).toEqual({ attr: 'some-value' });
  });
});
