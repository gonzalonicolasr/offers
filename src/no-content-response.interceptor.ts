import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
export const isMobileSourceName = (sourceName: string): boolean => ['ANDROID', 'IOS'].includes(sourceName);
@Injectable()
export class NoContentResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const sourceName = request.headers['x-source-name'];

    if (isMobileSourceName(sourceName)) {
      return next.handle().pipe(
        tap((data) => {
          if (data.length <= 0) {
            context.switchToHttp().getResponse().status(204);
          }
        }),
      );
    }
    return next.handle();
  }
}
