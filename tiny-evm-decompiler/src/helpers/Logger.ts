
const DEBUG = false;

export class Logger {
    public log(message?: any, ...optionalParams: any[]) {
        if (DEBUG){
            console.log(message, ...optionalParams);
        }
    }
}
