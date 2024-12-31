import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrapingService } from '../services/scraping.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  htmlContent: string = '';
  filteredContent: string = '';
  lawType: string = ''; 
  showSearch: boolean = false;

  constructor(
    private scrapingService: ScrapingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const param = params['param'];
      this.lawType = param; 
      this.loadContent();
    });
  }

  async loadContent() {
    const storedContent = await this.scrapingService.loadArticles(this.lawType);
    if (storedContent) {
      this.htmlContent = storedContent;
      console.log('Conteudo carregado do armazenamento:', this.htmlContent); 
    }

    this.scrapingService.fetchData(this.lawType).subscribe(async response => {
      this.htmlContent = response;
      console.log('conteudo carregado do servidor:', this.htmlContent); 
      await this.scrapingService.saveArticles(this.lawType, response);
    });
  }

  searchArticles(event: any) {
    const term = event?.target?.value || '';
    if (term.trim() !== '') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.htmlContent, 'text/html');
      const articles = doc.body.querySelectorAll('*');
      this.filteredContent = '';

      articles.forEach(article => {
        if (article.textContent && article.textContent.toLowerCase().includes(term.toLowerCase())) {
          this.filteredContent += article.outerHTML;
        }
      });
    } else {
      this.filteredContent = this.htmlContent;
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
}
