import { useCallback, useState } from "react";

export const useUploadProgress = () => {
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [progression, setProgresstion] = useState<number>(0);

  const uploadFiles = useCallback(async <T>(url: string, formData: FormData): Promise<T> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event: ProgressEvent<EventTarget>) => {
        const progression = Math.floor((event.loaded / event.total) * 100);

        setProgresstion(progression);
      });

      xhr.addEventListener("loadstart", () => {
        setShowProgressBar(true);
      });

      xhr.addEventListener("load", () => {
        setShowProgressBar(false);
        if (xhr.status !== 201) {
          reject();
        }
        const response: T = JSON.parse(xhr.response);

        resolve(response);
      });

      xhr.addEventListener("error", () => {
        setShowProgressBar(false);
        reject();
      });

      xhr.open("POST", url);
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
      xhr.send(formData);
    });
  }, []);

  return { showProgressBar, progression, uploadFiles };
};
