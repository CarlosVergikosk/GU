import {TranslateService} from '@ngx-translate/core';

constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
}

translate.get('HELLO', {value: 'Dayana'}).subscribe((res: string) => {
    console.log(res);
    //=> 'Hello Dayana'
});

param = {value: 'Dayana'};