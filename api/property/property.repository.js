import mongoose from "mongoose";
import { propertySchema } from "./property.schema.js";

export const PropertyModel = mongoose.model("Property", propertySchema);

export const createPropertyRepo = async (data) => {
  try {
    const newData = new PropertyModel(data);
    await newData.save();
    return { success: true, res: newData };
  } catch (err) {
    return { success: false, error: { statusCode: 400, msg: err } };
  }
};

export const deletePropertyRepo = async (user_id, property_id) => {
  try {
    
    const listing = await PropertyModel.findById(property_id);

    if (!listing) {
      return {
        success: false,
        error: { statusCode: 404, msg: "Listing not found" },
      };
    }
    if (user_id != listing.userRef) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: "You can only delete your own listings!",
        },
      };
    }
    const dataDeleted = await PropertyModel.findByIdAndDelete(property_id);
    return { success: true, res: dataDeleted };
  } catch (err) {
    return { success: false, error: { statusCode: 400, msg: err } };
  }
};

export const updatePropertyRepo = async (user_id, property_id, data) => {
  try {
    // console.log(user_id);
    // console.log(property_id);
    // console.log(typeof property_id);
    // if (!mongoose.Types.ObjectId.isValid(property_id))
    //   return {
    //     success: false,
    //     error: { statusCode: 405, msg: "Property not found" },
    //   };
    const listing = await PropertyModel.findById(property_id);  
    // if we provide the wrong property id it does show the Property not found error but instead it gives the
    // CastError: Cast to ObjectId failed it can be resolved by adding _id: String in the property Schema

    if (!listing) {
      return {
        success: false,
        error: { statusCode: 404, msg: "Property not found" },
      };
    }
    if (user_id !== listing.userRef) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: "You can only update your own property",
        },
      };
    }
    const updatedListing = await PropertyModel.findByIdAndUpdate(
      property_id,
      data,
      { new: true }
    );
    return { success: true, res: updatedListing };
  } catch (err) {
    if (err === null) {
      return {
        success: false,
        error: { statusCode: 404, msg: "Property not found" },
      };
    }
    console.log(err);
    return { success: false, error: { statusCode: 400, msg: err.message } };
  }
};
