import axios, {AxiosError, AxiosResponse} from "axios";
import {LoggerProxy} from "@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib";


type BearerResponse = {
    expiresAt: string,
    token: string
}

type ApiError = {
    message: string
}

export class LaceworkClient {

    private baseUrl: string;
    private userAgent: string;
    private accessKeyId: string;
    private secretKey: string;
    private loggerProxy: LoggerProxy;

    constructor({
                    url,
                    accessKeyId,
                    secretKey
                }: { url?: string, accessKeyId?: string, secretKey?: string}, userAgent?: string, loggerProxy?: LoggerProxy) {
        this.baseUrl = url;
        this.userAgent =userAgent;
        this.accessKeyId = accessKeyId;
        this.secretKey = secretKey;
        this.loggerProxy = loggerProxy;
    }

    public async doRequest<ResponseType>(method: 'get' | 'patch' | 'post' | 'delete' | 'put', path: string, params: any = {}, body?: {}): Promise<AxiosResponse<ResponseType>> {
        try {
            let token = (await this.getBearerToken()).data.token;
            return await axios.request<ResponseType>({
                url: `${this.baseUrl}${path}`,
                params: params,
                method: method,
                data: body,
                headers: {
                    'User-Agent': this.userAgent || "AWS CloudFormation (+https://aws.amazon.com/cloudformation/) CloudFormation custom resource",
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json; charset=utf-8',
                    Accept: 'application/json; charset=utf-8'
                }
            });
        } catch (e) {
            let error = e as AxiosError<ApiError>
            if(this.loggerProxy) {
                this.loggerProxy.log(`Do Request Error ${error.response.data.message} on method ${method}`);
            }
            throw e;
        }
    }

    private async getBearerToken() : Promise<AxiosResponse<BearerResponse>> {
        try {
            return await axios.request<BearerResponse>({
                url: `${this.baseUrl}/access/tokens`,
                params: {},
                method: "POST",
                data: {keyId: this.accessKeyId, expiryTime: 3600},
                headers: {
                    'User-Agent': this.userAgent || "AWS CloudFormation (+https://aws.amazon.com/cloudformation/) CloudFormation custom resource",
                    'Content-type': 'application/json; charset=utf-8',
                    Accept: 'application/json; charset=utf-8',
                    "X-LW-UAKS": this.secretKey
                }
            });
        } catch (e) {
            this.loggerProxy.log(`Get Bearer Token Error ${e}`);
            throw e;
        }
    }

}