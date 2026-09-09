import { Request, Response } from "express";
import {
  getCompaniesService,
  getCompanyByIdService,
} from "./company.service.js";

export const getCompaniesController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  const search = req.query.search as string | undefined;

  const result = await getCompaniesService(page, pageSize, search);

  res.status(200).json({
    success: true,
    message: "Companies fetched successfully",
    data: result,
  });
};

export const getCompanyByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const company = await getCompanyByIdService(id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Company fetched successfully",
    data: company,
  });
};
