export interface ResponseData<T> {
    message?: string;
    data?: T;
    meta: MetaPage;
  }

export interface MetaPage {
    total: number;
    totalPages: number;
    currentPage: number;
}