import { Component } from '@angular/core';

import { MyCoursePage } from '../MyCourse/MyCourse';
import { InformationPage } from '../Infor/Information';
import { PersonalPage } from '../Personal/Personal';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MyCoursePage;
  tab2Root: any = InformationPage;
  tab3Root: any = PersonalPage;

  constructor() {

  }
}
