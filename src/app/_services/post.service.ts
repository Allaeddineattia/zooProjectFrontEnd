import { API_URL, GET_ALL_POSTS, GET_POST_IMAGE } from './../_globals/globalURLs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private router: Router) { }

  private _allPosts = new BehaviorSubject(null);

  public get allPosts() {
    this.getAllPosts().subscribe();
    return this._allPosts;
  }

  private getAllPosts(): Observable<any> {
    return this.http.get(API_URL + GET_ALL_POSTS)
      .pipe(
        catchError(this.handleError),
        tap( resData => {
          console.log(resData);
          const result = [];
          for ( const data of resData) {
            this.http.get(API_URL + GET_POST_IMAGE + '/' + data['code'], {responseType: 'blob'}).subscribe(
              res => {
                result.push( { ...data,
                              image: res,
                              });
              }
            );

          }
          this._allPosts.next(result);
        })
      );
  }
  private handleError(error) {
    console.log(error);
    return throwError('we are fucked');
  }

  public uploadImage(file, title: string) {
    const formData = new FormData();
    formData.append('imagefile', file);
    formData.append('title', title);
    return this.http.post(API_URL + '/post', formData);
  }

}
