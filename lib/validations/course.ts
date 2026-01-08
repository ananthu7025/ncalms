import * as yup from "yup";

export const courseSchema = yup.object().shape({
    title: yup.string().required("Course title is required"),
    description: yup.string().optional(),
    streamId: yup.string().required("Learning stream is required"),
    examTypeId: yup.string().optional().nullable(),
    demoVideoUrl: yup.string().transform((curr, orig) => orig === "" ? null : curr).url("Must be a valid URL").nullable().optional(),
    bundlePrice: yup.string().when("isBundleEnabled", {
        is: true,
        then: (schema) => schema.required("Bundle price is required when bundle is enabled"),
        otherwise: (schema) => schema.optional(),
    }),
    isBundleEnabled: yup.boolean().default(false),
    isFeatured: yup.boolean().default(false),
    isMandatory: yup.boolean().default(false),
    isActive: yup.boolean().default(true),
    thumbnail: yup.string().optional(),
    syllabusPdfUrl: yup.string().transform((curr, orig) => orig === "" ? null : curr).url("Must be a valid URL").nullable().optional(),
    objectives: yup.string().optional(),
    additionalCoverage: yup.string().optional(),
    pricing: yup.array().of(
        yup.object().shape({
            contentTypeId: yup.string().required(),
            price: yup.string().matches(/^\d+(\.\d{1,2})?$/, "Invalid price format").default("0"),
            isIncluded: yup.boolean().default(true),
        })
    ).optional(),
});

export type CourseFormValues = yup.InferType<typeof courseSchema>;
