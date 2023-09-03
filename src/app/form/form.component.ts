import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form',
  template: `
    <div class="container">
      <div>
        <h1>Web scraping app</h1>
      </div>
      <form #form="ngForm" (submit)="logForm($event)">
        <div class="form-group mb-3">
          <label for="scrape_url">Enter a url for scraping: </label>
          <input type="text" id="scrape_url" name="scrape_url" class="form-control" [(ngModel)]="scrape_url" placeholder="Enter url" />
        </div>
        <div class="form-group mb-3">
          <label for="depth">Depth: </label>
          <input type="text" id="depth" name="depth" class="form-control" [(ngModel)]="depth" placeholder="Number of depth" />
        </div>
        <div class="form-group mb-3">
          <button type="submit" id="scrape" class="btn btn-primary">Scrape</button>
          
        </div>
        <div class="mb-3">
          <button type="submit" id="refresh" [style.display]="display_refresh === true ? 'block' : 'none'" class="btn btn-secondary">Refresh</button>
        </div>
        <div>
          {{error_message}}
        </div>
      </form>
      <div class="container-sm">
        <h2>Results</h2>
        <div [style.display]="spinner_flag === false ? 'none' : 'block'">
          <span class="loader"></span>
        </div>
        <div class="results_container">
          <pre [innerHTML]="html_result"></pre>
          
        </div>
      </div>
    </div>
  `,
  styles: [
    `.results_container {
      height: 200px;
      overflow: scroll;
      overflow-x: hidden;
    }
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
      }

    @keyframes rotation {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
    }

    `
  ]
})

export class FormComponent {
  scrape_url: string = '';
  depth: number = 0;
  html_result: any = '';
  display_refresh: boolean = false;
  error_message: string = '';
  spinner_flag: boolean = false;
  api_endpoint: string = `http://127.0.0.1:8000/api/`;

  async logForm(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    
    const valdation_result = await this.performValidations(/*url_validation, this.depth*/);
    if(valdation_result === false) {
      this.clearErrorMessage();
      return;
    }

    this.spinner_flag = true;
    this.html_result = '';
    const submit_type = event?.submitter?.id;
    const method = submit_type === 'scrape' ? 'post' : 'put';
    
    const data_object = {
      url: this.scrape_url,
      depth: this.depth
    }

    const result = await fetch(this.api_endpoint, {
      method: method,
      body: JSON.stringify(data_object),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const json = await result.json();
    if(json?.message) {
      this.error_message = json?.message;
      this.clearErrorMessage();
      return;
    }

    this.html_result = JSON.stringify(json?.data, null, 2)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
    this.spinner_flag = false;
    if(json?.stored === true) {
      this.display_refresh = true;
    }
    else {
      this.display_refresh = false;
    }
  }

  async performValidations(/*scrape_url: string, depth: number*/) {
    const url_validation = await this.urlValidation(this.scrape_url);
    let validation_flag = true;

    if(url_validation === false) {
      this.error_message = 'URL is not valid';
      validation_flag = false;
    }
    else if(isNaN(this.depth) || this.depth === 0) {
      this.error_message = 'Depth value is not valid';
      validation_flag = false;
    }
    return validation_flag;
  }

  async urlValidation(url: string) {
    const url_regex = /^(http(s?):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
    
    return url_regex.test(url);
  }

  async clearErrorMessage() {
    setTimeout(() => {
      this.error_message = '';
    }, 5000)
  }
}