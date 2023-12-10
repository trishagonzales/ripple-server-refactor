import { UploadResponse } from '../types/upload.types';

export interface IUploadPayload<T> {
  isNewEntry: boolean;
  createEntity(): Promise<T>;
  updateEntity(): Promise<T>;
  setUploadResponse(UploadResponse: UploadResponse): void;
}
