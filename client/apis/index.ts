import axios from 'axios';

export const indexData = async ({ source, type }) => {
    try {
        console.log(source, type);
        const formData = new FormData();
        formData.append("file", source);
        formData.append("type", type);
        const response = await axios.post(`https://notebooklm-server-zn3l.onrender.com/indexData`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(response);
    } catch (error) {
        console.log("Error in indexing data", error);
    }
}