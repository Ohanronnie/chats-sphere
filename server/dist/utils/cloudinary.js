import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
export default function upload(file, folder) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await cloudinary.v2.uploader.upload(file, {
                response_type: "auto",
                folder: folder,
            });
            resolve({
                url: result.url,
                id: result.public_id,
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
