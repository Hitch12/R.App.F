import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToasterComponent } from "../components/Toaster/Toaster.component";
import _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class Tools {
  baseUrl: string = "https://localhost:44327/api/"
  Toaster!: ToasterComponent
  constructor(public _httpClient: HttpClient) { }
  waitExecuteFunction(delay: number, func: any) {
    let timer = setTimeout(() => {
      func();
      clearTimeout(timer);
    }, delay)
  }
  startLoading() {

  }
  stopLoading() {

  }
  cloneObject(object: any): any {
    return _.cloneDeep(object)
  }
  public async getAsync<T>(url: string): Promise<T | undefined> {
    try {
      this.startLoading();
      let response = await this._httpClient.get<T>(this.baseUrl + url).toPromise();
      this.stopLoading();
      return response
    }
    catch (ex: any) {
      this.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async postAsync<T>(url: string, data: any): Promise<T | undefined> {
    try {
      this.startLoading();
      let response = await this._httpClient.post<T>(this.baseUrl + url, data).toPromise();
      this.stopLoading();
      return response
    }
    catch (ex: any) {
      this.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async putAsync<T>(url: string, data: any): Promise<T | undefined> {
    try {
      this.startLoading();
      let response = await this._httpClient.put<T>(this.baseUrl + url, data).toPromise();
      this.stopLoading();
      return response
    }
    catch (ex: any) {
      this.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async deleteAsync<T>(url: string, data: any = null): Promise<T | undefined> {
    try {
      this.startLoading();
      let response = await this._httpClient.delete<T>(this.baseUrl + url, { body: data }).toPromise();
      this.stopLoading();
      return response
    }
    catch (ex: any) {
      this.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }

}
