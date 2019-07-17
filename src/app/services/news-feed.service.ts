
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  apiKey = 'd948c11e91b04de9bbcd5bb0065a395c';
  constructor(private http: HttpClient) { }
  // Getting Initial Articles
  initSources() {
    return this.http.get('https://newsapi.org/v2/top-headlines?language=en&apiKey=' + this.apiKey);
  }
  // Getting  Articles By ID
  getArticlesByID(source: String) {
    return this.http.get('https://newsapi.org/v2/top-headlines?sources=' + source + ' &apiKey=' + this.apiKey);
  }

}
