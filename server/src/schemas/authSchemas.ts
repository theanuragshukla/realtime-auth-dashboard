import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
  device_details: z.object({
    ipAddress: z.string().ip({ version: 'v6' }),
    countryName: z.string(),
    countryCode: z.string(),
    region: z.string(),
    city: z.string(),
    cityLatLong: z.string(),
    browser: z.string(),
    browserVersion: z.string(),
    deviceBrand: z.string(),
    deviceModel: z.string(),
    deviceFamily: z.string(),
    os: z.string(),
    osVersion: z.string(),
  }),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  name: z.string(). min(3).max(128),
  twofactor: z.boolean(),
  device_details: z.object({
    ipAddress: z.string().ip({ version: 'v6' }),
    countryName: z.string(),
    countryCode: z.string(),
    region: z.string(),
    city: z.string(),
    cityLatLong: z.string(),
    browser: z.string(),
    browserVersion: z.string(),
    deviceBrand: z.string(),
    deviceModel: z.string(),
    deviceFamily: z.string(),
    os: z.string(),
    osVersion: z.string(),
  }),
});
