import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const bearerTokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
    let uServ = inject(UserService);   // now same instance of website bloggerservice

    // when an HTTP call is intercepted, we take an instance of BloggerService..
    // if token exists, we are going to set authorization header AUTOMATICALLY as part of request
    if (uServ.currentUserToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${uServ.currentUserToken.token}`
            } // we need to tell angular that we have this interceptor. How do we do it? Add to app.module to use it EVERYWHERE
        });
    }

  return next(req);
};
