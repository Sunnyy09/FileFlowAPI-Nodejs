/* 1. Store Only the secure_url (URL of the Uploaded Image)
 If you don't need the public_id (used for managing resources on Cloudinary),
 you can simplify your schema by storing only the URL of the uploaded image.
*/

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true }, // Store only the image URL
});

const result = await cloudinary.uploader.upload(req.file.path, {
  resource_type: "image",
});
fs.unlinkSync(req.file.path); // Remove the file from the local server

const newImage = new User({
  username,
  email,
  avatar: result.secure_url, // Store only the URL
});

await newImage.save();

/*
2. Use Cloudinary’s Auto-Generated IDs
If you want to save storage space in your database, you can skip storing public_id
and manage resources directly using the image URL. When necessary, extract the
public_id from the URL.
*/

/*
3. Upload Multiple Images with Minimal Data
If each user can upload multiple images, and you want to store only the URLs:
*/

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  avatar: [{ type: String }], // Array of image URLs
});

const uploadResults = await Promise.all(
  req.files.map(async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });
    fs.unlinkSync(file.path); // Remove the file from the local server
    return result.secure_url;
  })
);

const newImage = new User({
  username,
  email,
  avatar: uploadResults, // Array of URLs
});

await newImage.save();

/*
4. Save Only public_id and Generate URLs Dynamically
If you want to minimize database storage, store only the public_id and generate
URLs dynamically when needed.
*/
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true }, // Store only the public_id
});

//Generate the URL When Needed:
const imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${avatar.public_id}`;

/*
5. Use a Middleware to Handle Avatar Storage
You can implement a middleware in your Mongoose schema to manage the avatar 
field dynamically.
*/
userSchema.pre("save", async function (next) {
  if (!this.avatar.secure_url) {
    const result = await cloudinary.uploader.upload(this.avatar.filePath, {
      resource_type: "image",
    });
    this.avatar.public_id = result.public_id;
    this.avatar.secure_url = result.secure_url;
  }
  next();
});

/*
6. Store Images Externally and Use Cloudinary as a CDN
Instead of uploading images directly to Cloudinary, store them on another 
service (like AWS S3 or your own server) and use Cloudinary to optimize and
 serve the images via its CDN.
*/
