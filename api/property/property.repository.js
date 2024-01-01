import mongoose from "mongoose";
import { propertySchema } from "./property.schema.js";

export const PropertyModel = mongoose.model("Property", propertySchema)

export const createPropertyRepo = async (data) =>{
    try{
        const newData = new PropertyModel(data)
        await newData.save();
        return {success: true, res: newData}
    }catch(err){
        return { success: false, error: { statusCode: 400, msg: err} };
    }
}

export const deletePropertyRepo = async (user_id, property_id) =>{
    try{
        
        const listing = await PropertyModel.findById(property_id)
        
        if(!listing){
            return {success: false, error: {statusCode: 404, msg: 'Listing not found'}}
        }
        if(user_id != listing.userRef){
            return {success: false, error: {statusCode: 400, msg: 'You can only delete your own listings!'}}
        }
        const dataDeleted = await PropertyModel.findByIdAndDelete(property_id)
        return {success: true, res: dataDeleted}
    }catch(err){
        return {success: false, error: {statusCode: 400, msg: err}}
    }
}

