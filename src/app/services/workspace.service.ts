import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private baseUrl = 'http://localhost:3000/api/workspaces'; // Adjust the base URL as per actual backend API

  constructor(private http: HttpClient) { }

  createWorkspace(workspaceData: IWorkspace): Observable<IWorkspace> {
    return this.http.post<IWorkspace>(this.baseUrl, workspaceData);
  }

  getAllWorkspaces(): Observable<IWorkspace[]> {
    return this.http.get<IWorkspace[]>(this.baseUrl);
  }

  getWorkspaceById(id: number): Observable<IWorkspace> {
    return this.http.get<IWorkspace>(`${this.baseUrl}/${id}`);
  }

  updateWorkspace(id: number, workspaceData: Partial<IWorkspace>): Observable<IWorkspace> {
    return this.http.put<IWorkspace>(`${this.baseUrl}/${id}`, workspaceData);
  }

  deleteWorkspace(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

