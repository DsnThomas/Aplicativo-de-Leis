import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'page1',
        loadChildren: () => import('../page1/page1.module').then(m => m.Page1PageModule)
      },
      {
        path: 'page2',
        loadChildren: () => import('../page2/page2.module').then(m => m.Page2PageModule)
      },
      {
        path: 'page3',
        loadChildren: () => import('../page3/page3.module').then(m => m.Page3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
