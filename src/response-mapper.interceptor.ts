import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface MobileResponseBody<T> {
  data: T;
}
interface HttpRequest {
  headers: {
    [key: string]: string;
  };
}
const isMobileSourceName = (sourceName: string): boolean => ['ANDROID', 'IOS'].includes(sourceName);

@Injectable()
export class ResponseMapperInterceptor<T> implements NestInterceptor<T, MobileResponseBody<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<MobileResponseBody<T> | T> {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    const sourceName = request.headers['x-source-name'];
    if (isMobileSourceName(sourceName)) {
      return next.handle().pipe(map((data) => ({ data })));
    }
    return next.handle();
  }
}
