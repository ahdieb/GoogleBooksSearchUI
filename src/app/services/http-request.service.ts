import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInfo } from '../constants';

@Injectable({ providedIn: 'root' })
export class HttpRequestsService {

    private baseUrl = AppInfo.bookUrl;

    private lang = 'en';

    constructor(private httpClient: HttpClient) { }

    public getBooksByTerm(searchTerm: string, pageNumber: number): Observable<any> {
        if (searchTerm && searchTerm.length > 0) {
            return this.httpClient.get<any>(this.baseUrl + searchTerm + '&langRestrict=' + this.lang + '&startIndex=' + (pageNumber * AppInfo.pageSize));
        } else {
            return this.httpClient.get<any>(this.baseUrl + '&langRestrict=' + this.lang + '&startIndex=' + (pageNumber * AppInfo.pageSize));
        }
    }

}
