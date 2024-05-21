import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatStreamService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string,
  ) { }

  getCustomerData(customerId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/customer/${customerId}`)
  }

  getCustomerStreams(customerId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/customerstreams/${customerId}`);
  }

  getCustomerDeposits(customerId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/deposits/${customerId}`)
  }

  doStreamAction<T>(selectedStream: any): Observable<T>{
    return this.http.post<T>(this.baseUrl + `api/customerstreams`, { StreamId: selectedStream?.StreamId, StreamStatusId: selectedStream?.StreamStatusId + 1 })
  }

  createDeposit(newDepositAmount:any, customerId: any): Observable<string>{
    return this.http.post<string>(this.baseUrl + `api/deposits/${customerId}`, { customerid: customerId, amount: newDepositAmount })
  }
}
