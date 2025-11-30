import { z } from "zod";

export const passwordSchema = (
  name: string,
  min: number = 8,
  max: number = 32,
) =>
  z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} type is invalid`,
    })
    .min(min, { message: `${name} is too short` })
    .max(max, { message: `${name} is too long` })
    .refine(
      (password) => {
        if (!/[a-z]/.test(password)) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/\d/.test(password)) return false;
        if (!/[!@#$%^&*()-_=+{};:'",<.>\/?[\]\\]/.test(password)) return false;
        return true;
      },
      { message: "Invalid password format" },
    );

export const positiveNumberField = (
  val: string,
  min: number = 0,
  max?: number,
) =>
  z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        return +arg;
      }
      return arg;
    },
    z
      .number({
        required_error: `${val} is required`,
        invalid_type_error: `Provide valid type`,
      })
      .min(min, { message: "Must be a positive number" })
      .max(max ? max : Number.MAX_SAFE_INTEGER, { message: "" }),
  );

export const positiveNumberString = (name: string) =>
  z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: `${name} must be a positive number.`,
  });

export const ISODateString = (name: string) =>
  z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: `${name} must be a valid ISO date string (YYYY-MM-DD).`,
  });

export const ISODateTimeString = (name: string) =>
  z
    .string()
    .refine(
      (value) =>
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/.test(
          value,
        ),
      {
        message: `${name} must be a valid ISO date-time string.`,
      },
    );

export const percentageField = (val: string) =>
  z
    .number({
      required_error: `${val} is required`,
      invalid_type_error: `Provide valid type`,
    })
    .min(0, { message: "Must be a greater than or equals to 0" })
    .max(100, { message: "Must be a less than or equals to 100" });

export const emailField = (val: string) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    })
    .min(1, { message: `${val} is too short` })
    .email("Invalid email address")
    .transform((str) => str.trim().toLowerCase());

export const urlField = (val: string) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    })
    .url("Provide valid url");

export const stringField = (
  val: string,
  min: number = 1,
  max?: number,
  regex?: string,
) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    })
    .min(min, { message: `${val} is too short` })
    .transform((str) => str.trim())
    .refine((data) => (max ? data.length <= max : true), `${val} is too long`)
    .refine(
      (data) => (regex ? new RegExp(regex).test(data) : true),
      `${val} is of invalid format`,
    );

export const booleanField = (val: string) =>
  z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        const lowerCaseArg = arg.toLowerCase();
        if (lowerCaseArg === "true") return true;
        if (lowerCaseArg === "false") return false;
      }
      return arg;
    },
    z.boolean({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    }),
  );

export const enumField = <T extends string>(
  val: { [key: string]: T },
  name: string,
) =>
  z.enum(Object.values(val) as [T, ...T[]], {
    required_error: `${name} is required`,
    invalid_type_error: "Provide valid type",
  });

export const OrganizationID = z.object({
  organizationID: stringField("Organization ID"),
});
export type OrganizationID = z.infer<typeof OrganizationID>;

export const Id = z.object({
  id: stringField("ID"),
});

export type Id = z.infer<typeof Id>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: stringField("Search", 0).optional(),
});
