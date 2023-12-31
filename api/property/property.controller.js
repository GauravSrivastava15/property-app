import express from "express";
import { createPropertyRepo } from "./property.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export const createProperty = async (req, res, next) =>{
    const resp = await createPropertyRepo(req.body)
    if(resp.success){
        res.status(200).json({success: true, res: resp.res})
    }else{
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
    }
}