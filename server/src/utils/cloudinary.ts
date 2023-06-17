import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});
interface IResolve {
  url: string;
  id: string;
}
export default function upload(file: string, folder: string) {
  return new Promise(
    async (
      resolve: (value?: IResolve) => void,
      reject: (reason?: any) => void
    ): Promise<any> => {
      try {
        let result = await cloudinary.v2.uploader.upload(file, {
          response_type: "auto",
          folder: folder,
        });
        resolve({
          url: result.url,
          id: result.public_id,
        });
      } catch (err: any) {
        reject(err);
      }
    }
  );
}
