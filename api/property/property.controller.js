import express from "express";
import {
  createPropertyRepo,
  deletePropertyRepo,
  getListingRepo,
  getListingsRepo,
  updatePropertyRepo,
} from "./property.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";
import { PropertyModel } from "./property.repository.js";

export const createProperty = async (req, res, next) => {
  const resp = await createPropertyRepo(req.body);
  if (resp.success) {
    res.status(200).json({ success: true, res: resp.res });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const deleteProperty = async (req, res, next) => {
  const resp = await deletePropertyRepo(req.user, req.params.id);
  if (resp.success) {
    res.status(200).json("property deleted");
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const updateProperty = async (req, res, next) => {
  const resp = await updatePropertyRepo(req.user, req.params.id, req.body);
  if (resp.success) {
    res.status(200).json(resp.res);
  } else {
    // console.log(resp.error.statusCode);
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const getListing = async (req, res, next) => {
  const resp = await getListingRepo(req.params.id);

  if (resp.success) {
    res.status(200).json(resp.res);
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createAt";
    const order = req.query.order || "desc";

    

    const listings = await PropertyModel.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);

    // const resp = await getListingsRepo({offer, furnished, parking, type, sort, order, limit, searchTerm, startIndex});
    // if(resp.success){
    //     return res.status(200).json(resp.res)
    // }else{
    //     next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
    // }
  } catch (err) {
    next(new customErrorHandler(400, err));
  }
};
