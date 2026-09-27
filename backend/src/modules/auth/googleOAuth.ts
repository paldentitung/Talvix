import { google } from "googleapis";
import AppError from "../../utils/AppError.js";
import { GoogleUser } from "./auth.types.js";

export const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

export const getGoogleAuthUrl = (role?: "CANDIDATE" | "RECRUITER") => {
  return googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    state: role ?? "LOGIN",
  });
};

export const getGoogleUser = async (code: string): Promise<GoogleUser> => {
  const { tokens } = await googleOAuth2Client.getToken(code);

  googleOAuth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: googleOAuth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new AppError(
      "Unable to get required Google account information",
      400,
    );
  }

  return {
    id: data.id,
    email: data.email,
    given_name: data.given_name,
    family_name: data.family_name,
    picture: data.picture,
  };
};
