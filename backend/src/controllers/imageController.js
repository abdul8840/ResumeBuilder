import axios from "axios";
import sharp from "sharp";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { uploadToImageKit, deleteFromImageKit } from "../config/imagekit.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const removeBackground = async (imageBuffer) => {
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: "image/png" });
    formData.append("image_file", blob, "image.png");
    formData.append("size", "auto");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Background removal failed:", error.message);
    return imageBuffer; // Return original if removal fails
  }
};

// @desc    Upload profile image with background removal
// @route   POST /api/images/profile
// @access  Private
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const { removeBackground: shouldRemoveBg = true } = req.body;

    // Optimize image with sharp
    let processedBuffer = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: "cover",
        position: "center",
      })
      .png({ quality: 90 })
      .toBuffer();

    // Remove background if requested
    if (shouldRemoveBg === "true" || shouldRemoveBg === true) {
      processedBuffer = await removeBackground(processedBuffer);
    }

    // Delete old images if they exist
    const user = await User.findById(req.user._id);
    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId).catch(console.error);
    }
    if (user.profileImage?.imageKitFileId) {
      await deleteFromImageKit(user.profileImage.imageKitFileId).catch(console.error);
    }

    // Upload to ImageKit (primary)
    let imageKitResult;
    let cloudinaryResult;

    try {
      imageKitResult = await uploadToImageKit(
        processedBuffer,
        `profile-${req.user._id}.png`,
        "/resume-builder/profiles"
      );
    } catch (ikError) {
      console.error("ImageKit upload failed, using Cloudinary:", ikError.message);
    }

    // Upload to Cloudinary (backup/CDN)
    try {
      cloudinaryResult = await uploadToCloudinary(
        processedBuffer,
        "resume-builder/profiles",
        {
          public_id: `profile_${req.user._id}`,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        }
      );
    } catch (cdError) {
      console.error("Cloudinary upload error:", cdError.message);
    }

    // Create thumbnail
    const thumbnailBuffer = await sharp(processedBuffer)
      .resize(100, 100, { fit: "cover" })
      .png()
      .toBuffer();

    // Update user profile
    const profileImage = {
      url: cloudinaryResult?.secure_url || imageKitResult?.url || "",
      publicId: cloudinaryResult?.public_id || "",
      imageKitFileId: imageKitResult?.fileId || "",
      thumbnailUrl: cloudinaryResult?.secure_url || imageKitResult?.thumbnailUrl || "",
    };

    await User.findByIdAndUpdate(req.user._id, { profileImage });

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully! 🖼️",
      data: {
        profileImage,
        backgroundRemoved: shouldRemoveBg === "true" || shouldRemoveBg === true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile image
// @route   DELETE /api/images/profile
// @access  Private
export const deleteProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId).catch(console.error);
    }

    if (user.profileImage?.imageKitFileId) {
      await deleteFromImageKit(user.profileImage.imageKitFileId).catch(console.error);
    }

    await User.findByIdAndUpdate(req.user._id, {
      profileImage: { url: "", publicId: "", imageKitFileId: "", thumbnailUrl: "" },
    });

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume section image (project screenshot, etc.)
// @route   POST /api/images/resume-asset
// @access  Private
export const uploadResumeAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(800, 600, { fit: "inside" })
      .jpeg({ quality: 85 })
      .toBuffer();

    const result = await uploadToCloudinary(
      optimizedBuffer,
      "resume-builder/assets",
      { quality: "auto" }
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    next(error);
  }
};