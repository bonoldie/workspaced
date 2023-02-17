import path from "path";

export default function rendererURL(rendererFileName: string ) {
    if(__NODE_ENV__ === "development") {
        return `http://${__DEV_SERVER__.HOST}:${__DEV_SERVER__.PORT}/${rendererFileName}`;
    }

    return `file:///${path.resolve(`./${rendererFileName}`)}`;
}