import fb from "../firebase/firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

export const useFirebase = () => {
  const uploadIMG = (img: any) => {
    if (!img) {
      console.error("Data is not an image!");
      return null;
    }

    return new Promise((resolve, reject) => {
      const imageRef = storageRef(fb.storage, `/avatar/${uuidv4()}`);
      uploadBytes(imageRef, img)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url: string) => {
              resolve(url);
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const deleteIMG = (imgURL: string) => {
    const urlPattern =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    if (!urlPattern.test(imgURL)) {
      console.error(`${imgURL} is not a link`);
      return null;
    }

    return new Promise<void>((resolve, reject) => {
      const imageRef = storageRef(fb.storage, imgURL);

      deleteObject(imageRef)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  return { uploadIMG, deleteIMG };
};
