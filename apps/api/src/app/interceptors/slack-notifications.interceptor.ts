import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpService,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { URLQueryParams } from '@letsshareatoast/shared';

@Injectable()
export class SlackNotificationsInterceptor implements NestInterceptor {
  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const { query } = context.switchToHttp().getRequest();

        if (URLQueryParams.NOTIFY_SLACK_MESSAGE in query) {
          const {
            EKIBOT_SLACK_NOTIFICATION_ENDPOINT,
            EKIBOT_SLACK_NOTIFICATION_CHANNEL,
          } = process.env;

          return this.httpService
            .post(EKIBOT_SLACK_NOTIFICATION_ENDPOINT, {
              room: EKIBOT_SLACK_NOTIFICATION_CHANNEL,
              message: query[URLQueryParams.NOTIFY_SLACK_MESSAGE],
            })
            .toPromise();
        }
      })
    );
  }
}
