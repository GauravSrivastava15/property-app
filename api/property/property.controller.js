import express from "express";
import { createPropertyRepo, deletePropertyRepo, getListingRepo, updatePropertyRepo } from "./property.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export const createProperty = async (req, res, next) =>{
    const resp = await createPropertyRepo(req.body)
    if(resp.success){
        res.status(200).json({success: true, res: resp.res})
    }else{
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
    }
}

export const deleteProperty = async (req, res, next) =>{
    const resp = await deletePropertyRepo(req.user, req.params.id)
    if(resp.success){
        res.status(200).json("property deleted")
    }else{
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
    }
}

export const updateProperty = async (req, res, next) =>{
    
    const resp = await updatePropertyRepo(req.user, req.params.id, req.body)
    if(resp.success){
        res.status(200).json(resp.res)
    }else{
        console.log(resp.error.statusCode)
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
    }
}

export const getListing = async(req, res, next) =>{
    const resp = await getListingRepo(req.params.id)
    
    if(resp.success){
        res.status(200).json(resp.res)
    }else{
        next (new customErrorHandler(resp.error.statusCode, resp.error.msg))
    }
}