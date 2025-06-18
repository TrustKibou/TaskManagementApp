import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const noauthGuard: CanActivateFn = (route, state) => {
    let userService = inject(UserService);
    let router = inject(Router);

    // ALLOW ACCESS IF USER IS LOGGED IN
    if (userService.currentUserToken) {
        return true;
    }

    // DENY ACCESS IF USER IS NOT LOGGED IN
    else {
        router.navigate(['/login']);
        alert("You must be logged in to view this page.");
        return false;
    }
};
