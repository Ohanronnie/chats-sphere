export function defaultConfig(req, res, next) {
    console.log(req.headers["x-forwarded-for"]);
    let headers = req.headers;
    if (req.originalUrl.includes("/images"))
        return next();
    let FrontEndUrl = process.env.FRONTENDURL;
    console.log(req.socket.remoteAddress);
    if (!headers.origin || !headers.referer || !headers["user-agent"]) {
        return res.status(200).json({
            message: "No permission to access this source",
        });
    }
    else {
        try {
            let originURL = [
                req.headers.origin,
                req.headers.referer,
            ];
            for (let uri of originURL) {
                let urlObject = new URL(uri);
                if (urlObject.origin !== FrontEndUrl) {
                    return res.status(400).json({
                        message: "Cross Origin Request Not Supported",
                    });
                }
            }
            next();
        }
        catch (error) {
            return res.status(error.code || 400).json({
                message: "Bad Request",
            });
        }
    }
}
