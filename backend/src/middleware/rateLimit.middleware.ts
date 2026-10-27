import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

const createLimiter = (windowMinutes: number, limit: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTest,
  });

export const globalLimiter = createLimiter(
  15,
  300,
  "Too many requests. Please try again later.",
);

//  Auth
export const loginLimiter = createLimiter(
  15,
  10,
  "Too many login attempts. Please try again after 15 minutes.",
);
export const registerLimiter = createLimiter(
  60,
  5,
  "Too many accounts created. Please try again after an hour.",
);
export const verifyEmailLimiter = createLimiter(
  15,
  5,
  "Too many verification attempts. Please try again after 15 minutes.",
);
export const forgotPasswordLimiter = createLimiter(
  60,
  3,
  "Too many password reset requests. Please try again later.",
);
export const resetPasswordLimiter = createLimiter(
  60,
  5,
  "Too many password reset attempts. Please try again later.",
);
export const changePasswordLimiter = createLimiter(
  60,
  5,
  "Too many password change attempts. Please try again later.",
);

//  Profile & uploads
export const updateProfileLimiter = createLimiter(
  15,
  10,
  "Too many profile updates. Please slow down.",
);
export const uploadLimiter = createLimiter(
  60,
  20,
  "Upload limit reached. Please try again later.",
);

//  Job portal actions
export const applyJobLimiter = createLimiter(
  60,
  30,
  "Too many applications submitted. Please try again later.",
);
export const jobWriteLimiter = createLimiter(
  15,
  20,
  "Too many job changes. Please slow down.",
);
export const reportLimiter = createLimiter(
  60,
  5,
  "Too many reports submitted. Please try again later.",
);
