"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCloudinary = exports.uploadToCloudinary = void 0;
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
const uploadToCloudinary = (path, folder) => {
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
        .then((data) => {
        return { url: data.url, public_id: data.public_id };
    })
        .catch((error) => {
        console.log(error);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const removeFromCloudinary = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield cloudinary.v2.uploader.destroy(public_id, function (error, result) {
        console.log(result, error);
    });
});
exports.removeFromCloudinary = removeFromCloudinary;
