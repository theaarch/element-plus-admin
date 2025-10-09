import http from "@/utils/http";

const FileAPI = {
  /** 上传文件 （传入 FormData，上传进度回调） */
  upload(formData: FormData, onProgress?: (percent: number) => void) {
    return http<any, FileInfo>({
      url: "/api/v1/files",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    });
  },

  /** 上传文件（传入 File） */
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return http.post<any, FileInfo>("/api/v1/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** 删除文件 */
  delete(filePath?: string) {
    return http.delete("/api/v1/files", {
      params: { filePath },
    });
  },

  /** 下载文件 */
  download(url: string, fileName?: string) {
    return http
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const urlObject = window.URL.createObjectURL(blob);
        a.href = urlObject;
        a.download = fileName || "下载文件";
        a.click();
        window.URL.revokeObjectURL(urlObject);
      });
  },
};

export default FileAPI;

export interface FileInfo {
  name: string;
  url: string;
}
