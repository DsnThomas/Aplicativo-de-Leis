import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ScrapingService {
  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  // Verifica se está online, com fallback para requisição de teste
  async isOnline(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      console.log('Network status:', status);

      // Fallback: Verifica a conectividade diretamente
      if (!status.connected) {
        console.log('Verificando conectividade com fallback...');
        const online = await this.testConnectivity();
        console.log('Conectividade detectada via fallback:', online);
        return online;
      }

      return status.connected;
    } catch (error) {
      console.error('Erro ao verificar o status da rede:', error);
      return this.testConnectivity(); // Verificação alternativa
    }
  }

  // Fallback para verificar a conectividade com uma requisição de teste
  private async testConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar conectividade com o fallback:', error);
      return false;
    }
  }

  // Busca do servidor ou carrega do armazenamento local
  fetchData(lawType: string): Observable<string> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          const serverUrl = `https://laws-api.onrender.com/laws/${lawType}`;
          console.log('Conectado, buscando dados do servidor:', serverUrl);
          return this.http.get(serverUrl, { responseType: 'text' }).pipe( // Ajustado para texto
            switchMap(response => {
              // Salva no armazenamento
              this.saveArticles(lawType, response);
              return of(response);
            }),
            catchError(error => {
              console.warn('Erro ao buscar dados do servidor, carregando conteúdo offline...', error);
              return this.loadLocalContent(lawType);
            })
          );
        } else {
          console.log('Modo offline, carregando conteúdo do armazenamento local...');
          return this.loadLocalContent(lawType);
        }
      }),
      catchError(error => {
        console.warn('Erro ao detectar o status da rede, carregando conteúdo offline...', error);
        return this.loadLocalContent(lawType);
      })
    );
  }

  // Carrega o conteúdo do armazenamento local
  loadLocalContent(lawType: string): Observable<string> {
    return from(this.loadArticles(lawType)).pipe(
      switchMap(content => {
        if (content) {
          return of(content);
        } else {
          return throwError(() => new Error('Conteúdo offline não disponível'));
        }
      })
    );
  }

  // Salva o conteúdo HTML de uma lei específica
  async saveArticles(lawType: string, html: string) {
    await this.storage.set(`articles_${lawType}`, html);
    console.log(`HTML da lei ${lawType} salvo no armazenamento local:`, html);
  }

  // Carrega o conteúdo HTML de uma lei específica
  async loadArticles(lawType: string): Promise<string> {
    const html = await this.storage.get(`articles_${lawType}`); // Carregar o conteúdo pela chave específica da lei
    console.log(`HTML da lei ${lawType} carregado do armazenamento local:`, html);
    return html || '';
  }
}
