require("dotenv").config();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dyacfa943",
  api_key: process.env.API_KEY || "917671776558137",
  api_secret: process.env.API_SECRET || "VJe9BFB8y6BgFj6Z8Vs8AE9tbSU",
});

// exports.uploads = (file) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
//         resolve({ url: result.url, id: result.public_id });
//       },
//       { resource_type: "auto" }
//     );
//   });
// };
// {
//           resource_type: "video",
//           public_id: "myfolder/mysubfolder/dog_closeup",
//           chunk_size: 6000000,
//           eager: [
//             { width: 300, height: 300, crop: "pad", audio_codec: "none" },
//             {
//               width: 160,
//               height: 100,
//               crop: "crop",
//               gravity: "south",
//               audio_codec: "none",
//             },
//           ],
//           eager_async: true,
//           // eager_notification_url:
//           //   "https://mysite.example.com/notify_endpoint",
//         }

export const uploadToCloudinary = (path: any, folder: any) => {
  // Folder is the folder name created from clouddinary UI dashboard
  return cloudinary.v2.uploader
    .upload(path, {
      folder,
      resource_type: "video",
      public_id: "myfolder/mysubfolder/dog_closeup",
      // chunk_size: 6000000,
      // eager: [
      //   { width: 300, height: 300, crop: "pad", audio_codec: "none" },
      //   {
      //     width: 160,
      //     height: 100,
      //     crop: "crop",
      //     gravity: "south",
      //     audio_codec: "none",
      //   },
      // ],
      // eager_async: true,
    })
    .then((data: any) => {
      return { url: data.url, public_id: data.public_id };
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const removeFromCloudinary = async (public_id: any) => {
  await cloudinary.v2.uploader.destroy(
    public_id,
    function (error: any, result: any) {
      console.log(result, error);
    }
  );
};
