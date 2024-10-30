import myAxiosRequester from "@/shared/axios.js";
import {HttpStatusCode} from "axios";
export default async function getDeviceTypeName(userData, deviceTypeId) {
    const response = await myAxiosRequester.post(`device-types/${deviceTypeId}/get`, {
        token: userData.token
    });
    if(response && response.status === HttpStatusCode.Ok && response.data)
        return response.data;
    return false;
}