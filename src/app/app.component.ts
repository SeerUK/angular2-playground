import { Component } from "@angular/core";

@Component({
    selector: "app",
    template: `
        <div>
            Hello, World!
            <img src="${require('img/stock/pexels-photo-54278.jpeg')}" alt="">
        </div>
    `
})
export class AppComponent{}
