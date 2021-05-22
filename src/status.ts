
export enum ELoginMehtod {
    unknow = 0,
    phone = 1,
    pc = 2,
    ipad = 3,
    macos = 4,
    browser = 5,
}

export interface IUserLogionShareStatus {

    loginAccount: String;
    loginMethod: ELoginMehtod;
    loginServer: string;
    loginTime: number;
}

export type UserLogionShareStatusSet = {
    length: number;
    userLogionShareStatus: IUserLogionShareStatus[];
}

export type logStatus = Map<string, UserLogionShareStatusSet>;
