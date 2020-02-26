import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';

@Injectable()
export class PostProvider {
	server: string = "http://192.168.0.108/GU/server_api/"; // default

	constructor(public http : Http) {

	}

	postData(body, file){
		let type = "application/json; charset=UTF-8";
		let headers = new Headers({ 'Content-Type': type });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(this.server + file, JSON.stringify(body), options).timeout(5000).map(res =>  res.json());
	}

	getData(file, body){
		console.log(JSON.stringify(body))
        return this.http.get(this.server + file, JSON.stringify(body)).map(res =>  res.json());
    }
}