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
    region,
  } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;

  const baseQuery = {
    isProfileComplete: true,
    ...(region && { "location.region": region }),
  };
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
    price_asc: { price_per_hour: 1, name: 1 },
    price_desc: { price_per_hour: -1, name: 1 },
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

  const [totalItems, data] = await Promise.all([
    nanniesQuery.clone().countDocuments(),
    nanniesQuery.skip(skip).limit(perPageNum),
  ]);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages: Math.ceil(totalItems / perPageNum),
    data,
  });
});

export const getNannyById = catchAsync(async (req, res) => {
  const { nannyId } = req.params;

  const nanny = await Nanny.findOne({ _id: nannyId, isProfileComplete: true });

  if (!nanny) {
    throw createHttpError(404, "Nanny not found");
  }

  const reviews = await Review.find({ nannyId }).populate(
    "authorId",
    "name avatar",
  );

  res.status(200).json({
    data: {
      nanny,
      reviews,
    },
  });
});

export const updateMyNannyProfile = catchAsync(async (req, res) => {
  const nanny = await Nanny.findOneAndUpdate(
    { userId: req.user.id },
    { $set: req.body },
    { returnDocument: "after", runValidators: true },
  );

  if (!nanny) throw createHttpError(404, "Nanny not found");

  const isProfileComplete =
    nanny.avatar_url.length > 0 &&
    Boolean(nanny.birthday) &&
    nanny.experience.length > 0 &&
    nanny.education.length > 0 &&
    nanny.kids_age.length > 0 &&
    nanny.price_per_hour > 0 &&
    nanny.location.country.length > 0 &&
    nanny.location.region.length > 0 &&
    nanny.location.settlement.length > 0 &&
    nanny.about.length > 0 &&
    nanny.characters.length > 0;

  nanny.isProfileComplete = isProfileComplete;

  await nanny.save();

  res.status(200).json({
    message: "Profile updated successfully",
    data: nanny,
  });
});

export const getMyNannyProfile = catchAsync(async (req, res) => {
  const nanny = await Nanny.findOne({ userId: req.user.id });

  if (!nanny) {
    throw createHttpError(404, "Nanny not found");
  }

  res.status(200).json({
    data: nanny,
  });
});
