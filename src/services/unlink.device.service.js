import myAxiosRequester from "@/shared/axios.js";
import { HttpStatusCode } from "axios";
// Esta funcion no tiene manejo de errores, por lo que si algo falla
// el error se propagará hasta la funcion que la invoque
export default async function unlinkDevice(userData, propertyId, deviceId, devicePassword) {
    const response = await myAxiosRequester.post(`user/${userData.id}/devices/unlink`, {
        token: userData.token,
        deviceId: deviceId,
        password: devicePassword,
        propertyId: propertyId
    });
    console.log(response)
    if(response && response.status === HttpStatusCode.Ok && response.data) {
        return response.data;
    }
    return false;
}