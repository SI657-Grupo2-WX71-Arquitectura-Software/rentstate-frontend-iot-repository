import myAxiosRequester from "@/shared/axios.js";
import { HttpStatusCode } from "axios";
// Esta funcion no tiene manejo de errores, por lo que si algo falla
// el error se propagará hasta la funcion que la invoque
export default async function properties(userData) {
    const response = await myAxiosRequester.post(`user/${userData.id}/properties/list`, {
        token: userData.token
    });
    if(response && response.status === HttpStatusCode.Ok && response.data)
        return response.data;
    return false;
}