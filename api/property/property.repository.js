import mongoose from "mongoose";
import { propertySchema } from "./property.schema.js";

const PropertyModel = mongoose.model("Property", propertySchema)

export const createPropertyRepo = async (data) =>{
    try{
        const newData = new PropertyModel(data)
        await newData.save();
        return {success: true, res: newData}
    }catch(err){
        return { success: false, error: { statusCode: 400, msg: err} };
    }
}

