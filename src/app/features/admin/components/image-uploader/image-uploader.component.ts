import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadedFile } from '../../../../core/models/uploadedFile.model';

@Component({
  selector: 'app-image-uploader',
  imports: [],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.sass',
})
export class ImageUploaderComponent {
  @Input() maxFileSizeMB = 5;
  @Output() filesChanged = new EventEmitter<File[]>();

  uploadedFiles: UploadedFile[] = [];
  isDragging = false;
  errorMessage = '';

  private isValidFileSize(file: File): boolean {
    return file.size <= this.maxFileSizeMB * 1024 * 1024;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) this.handleFiles(files);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.handleFiles(input.files);
  }

  private handleFiles(fileList: FileList) {
    this.errorMessage = '';

    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = `${file.name} is not an image file`;
        return;
      }

      if (!this.isValidFileSize(file)) {
        this.errorMessage = `${file.name} exceeds the maximum file size`;
        return;
      }

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        sizeFormatted: this.formatFileSize(file.size),
        data: file,
      };

      this.uploadedFiles.push(uploadedFile);
    });

    this.emitChanges();
  }

  removeFile(file: UploadedFile) {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.emitChanges();
    }
  }

  private emitChanges() {
    const files = this.uploadedFiles.map((file) => file.data);
    this.filesChanged.emit(files);
  }
}
