import axios from "axios";
import FormData from "form-data";

export const getEmbeddings = async (fileBuffer, name) => {
    // make a post request with multipart file in form data to the api https://melomint.centralindia.cloudapp.azure.com/embeddings
  
    const formData = new FormData();
    console.log('filename: ', name+';type=audio/mpeg')
    formData.append("file", fileBuffer, name);
  
    try {
      console.log("sending file to get embeddings");
      const res = await axios.post(
        "https://melomint.centralindia.cloudapp.azure.com/embeddings",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "Content-Type": "multipart/form-data;",
            Accept: "application/json",
          },
        }
      );
  
      // console.log(res.data);
      return res.data;
  
    } catch (error) {
      console.log(error);
      return error;
    }
  };