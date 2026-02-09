import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private readonly API_URL = "https://rwawebfree.vercel.app/api/proxy";

  apiCall<T>(endpoint: string): Observable<{ data: T } | { data: [] }> {
    this.toastService.show('Fetching data...', 'info');
    return this.http.get<{ data: T }>(`${this.API_URL}?endpoint=${encodeURIComponent(endpoint)}`).pipe(
      catchError(error => {
        console.error(error);
        this.toastService.show('Network Error', 'error');
        // FIX: The type `never[]` is not assignable to the zero-length tuple `[]` expected by the return type.
        // Casting to `[]` ensures type compatibility.
        return of({ data: [] as [] });
      }),
      finalize(() => {
        // You could hide a global loader here if you had one
      })
    );
  }
}
