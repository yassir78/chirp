import {Injectable} from "@angular/core";
import {AuthState} from "../states/auth.state";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {

  constructor(private authService: AuthService, private authState: AuthState) {
  }


  isUpdating() : Observable<boolean>{
    return this.authState.isUpdating$();
  }

}
