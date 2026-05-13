import createHttpError from "http-errors";
import { Nanny } from "../models/Nanny.js";
import { Review } from "../models/Review.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllNannies = catchAsync(async (req, res) => {
  const {
    page = 1,
    perPage = 3,
    sort = "a_to_z",
    filter = "show_all",
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;

  const baseQuery = { isProfileComplete: true };
  const filterMap = {
    less_than_18: {
      query: { price_per_hour: { $lt: 18 } },
      defaultSort: { price_per_hour: -1, name: 1 },
    },
    greater_than_18: {
      query: { price_per_hour: { $gt: 17 } },
      defaultSort: { price_per_hour: -1, name: 1 },
    },
    show_all: {
      query: {},
      defaultSort: null,
    },
  };

  const sortMap = {
    a_to_z: { name: 1 },
    z_to_a: { name: -1 },
    popular: { rating: -1, name: 1 },
    not_popular: { rating: 1, name: 1 },
  };

  const filterEntry = filterMap[filter] ?? { query: {}, defaultSort: null };
  const filterQuery = {
    ...baseQuery,
    ...filterEntry.query,
  };
  const sortOrder =
    filterEntry.defaultSort && sort === "a_to_z"
      ? filterEntry.defaultSort
      : (sortMap[sort] ?? { name: 1 });

  const nanniesQuery = Nanny.find(filterQuery).sort(sortOrder);

  const [totalItems, nannies] = await Promise.all([
    nanniesQuery.clone().countDocuments(),
    nanniesQuery.skip(skip).limit(perPageNum),
  ]);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages: Math.ceil(totalItems / perPageNum),
    nannies,
  });
});

export const getNannyById = catchAsync(async (req, res) => {
  const { nannyId } = req.params;

  const [nanny, reviews] = await Promise.all([
    Nanny.findById(nannyId),
    Review.find({ nannyId }),
  ]);

  if (!nanny) {
    throw createHttpError(404, "Nanny not found");
  }

  res.status(200).json({
    data: {
      nanny,
      reviews,
    },
  });
});
