import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { NoContentResponseInterceptor } from './no-content-response.interceptor';

const createMockExecutionContext = (sourceName: string) => {
  const responseMock = {
    status: jest.fn(),
  };

  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { 'x-source-name': sourceName },
      }),
      getResponse: () => responseMock,
    }),
  } as ExecutionContext;
};

const createMockCallHandler = (data: any[]) =>
  ({
    handle: () => of(data),
  }) as CallHandler;

describe('NoContentResponseInterceptor', () => {
  let interceptor: NoContentResponseInterceptor;

  beforeEach(() => {
    interceptor = new NoContentResponseInterceptor();
  });

  it('Debería modificar el status code a 204 cuando no haya ofertas y el request sea desde ANDROID', () => {
    const mockExecutionContext = createMockExecutionContext('ANDROID');
    const mockCallHandler = createMockCallHandler([]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).toBeCalledWith(204);
    });
  });

  it('Debería mantener la respuesta cuando haya ofertas y el request sea desde ANDROID', () => {
    const mockExecutionContext = createMockExecutionContext('ANDROID');
    const mockCallHandler = createMockCallHandler([{ id: 'offer-id' }]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).not.toBeCalled();
    });
  });

  it('Debería modificar el status code a 204 cuando no haya ofertas y el request sea desde IOS', () => {
    const mockExecutionContext = createMockExecutionContext('IOS');
    const mockCallHandler = createMockCallHandler([]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).toBeCalledWith(204);
    });
  });

  it('Debería mantener la respuesta cuando haya ofertas y el request sea desde IOS', () => {
    const mockExecutionContext = createMockExecutionContext('IOS');
    const mockCallHandler = createMockCallHandler([{ id: 'offer-id' }]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).not.toBeCalled();
    });
  });

  it('Debería mantener la respuesta cuando no haya ofertas y el request sea desde WEB', () => {
    const mockExecutionContext = createMockExecutionContext('WEB');
    const mockCallHandler = createMockCallHandler([]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).not.toBeCalled();
    });
  });

  it('Debería mantener la respuesta cuando haya ofertas y el request sea desde WEB', () => {
    const mockExecutionContext = createMockExecutionContext('WEB');
    const mockCallHandler = createMockCallHandler([{ id: 'offer-id' }]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockExecutionContext.switchToHttp().getResponse().status).not.toBeCalled();
    });
  });
});
