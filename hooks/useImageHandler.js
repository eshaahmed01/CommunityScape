import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default function useImageHandler () {

    const uploadImageToFirebase = async (path, imageUri) => {
        try {
          const storage = getStorage();
          const response = await fetch(imageUri); 
          const blob = await response.blob(); 
      
          const storageRef = ref(storage, `${path}/${Date.now()}.jpg`); 
          await uploadBytes(storageRef, blob); 
      
          const downloadURL = await getDownloadURL(storageRef); 
          return downloadURL;
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      };
    return {
        uploadImageToFirebase
    }
}