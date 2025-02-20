import { z } from 'zod';

export function searchFlightsSearchParamsSchema() {
  return z.object({
    originLocationCode: z
      .string()
      .min(3)
      .max(3)
      .describe('IATA code of the departure airport'),
    destinationLocationCode: z
      .string()
      .min(3)
      .max(3)
      .describe('IATA code of the arrival airport'),
    departureDate: z
      .string()
      .describe('Date of departure in YYYY-MM-DD format'),
    returnDate: z
      .string()
      .nullish()
      .describe('Optional date of return in YYYY-MM-DD format'),
    adults: z.coerce
      .number()
      .min(1)
      .describe('Number of adult passengers (12+ years)'),
    children: z.coerce
      .number()
      .min(0)
      .nullish()
      .describe('Number of child passengers (2-11 years)'),
    infants: z.coerce
      .number()
      .min(0)
      .nullish()
      .describe('Number of infant passengers (0-2 years)'),
    travelClass: z
      .enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'])
      .nullish()
      .describe('Preferred cabin class for the flight'),
    maxPrice: z.coerce
      .number()
      .nullish()
      .describe('Maximum price for the flight'),
    currencyCode: z
      .string()
      .length(3)
      .nullish()
      .default('USD')
      .describe('Three-letter currency code'),
    nonStop: z
      .boolean()
      .nullish()
      .default(false)
      .describe('Filter for direct flights only'),
    max: z.coerce
      .number()
      .min(1)
      .max(250)
      .nullish()
      .default(5)
      .describe('Maximum number of results to return'),
    includedAirlineCodes: z
      .string()
      .nullish()
      .describe('Comma-separated list of preferred airline IATA codes'),
    excludedAirlineCodes: z
      .string()
      .nullish()
      .describe('Comma-separated list of airline IATA codes to exclude'),
  });
}

const segmentSchema = z.object({
  departure: z.object({
    iataCode: z.string(),
    terminal: z.string().optional(),
    at: z.string(),
  }),
  arrival: z.object({
    iataCode: z.string(),
    terminal: z.string().optional(),
    at: z.string(),
  }),
  carrierCode: z.string(),
  number: z.string(),
  aircraft: z.object({
    code: z.string(),
  }),
  operating: z.object({
    carrierCode: z.string(),
  }),
  duration: z.string(),
  id: z.string(),
  numberOfStops: z.number(),
  blacklistedInEU: z.boolean(),
});

const itinerarySchema = z.object({
  duration: z.string(),
  segments: z.array(segmentSchema),
});

const priceSchema = z.object({
  currency: z.string(),
  total: z.string(),
  base: z.string(),
});

const fareDetailSchema = z.object({
  segmentId: z.string(),
  cabin: z.string(),
  fareBasis: z.string(),
  class: z.string(),
  includedCheckedBags: z.object({
    weight: z.number(),
    weightUnit: z.string(),
  }),
});

const travelerPricingSchema = z.object({
  travelerId: z.string(),
  fareOption: z.string(),
  travelerType: z.string(),
  price: priceSchema,
  fareDetailsBySegment: z.array(fareDetailSchema),
});

const flightOfferSchema = z.object({
  type: z.string(),
  id: z.string(),
  source: z.string(),
  instantTicketingRequired: z.boolean(),
  nonHomogeneous: z.boolean(),
  oneWay: z.boolean(),
  lastTicketingDate: z.string(),
  numberOfBookableSeats: z.number(),
  itineraries: z.array(itinerarySchema),
  price: z.object({
    ...priceSchema.shape,
    fees: z.array(
      z.object({
        amount: z.string(),
        type: z.string(),
      })
    ),
    grandTotal: z.string(),
  }),
  pricingOptions: z.object({
    fareType: z.array(z.string()),
    includedCheckedBagsOnly: z.boolean(),
  }),
  validatingAirlineCodes: z.array(z.string()),
  travelerPricings: z.array(travelerPricingSchema),
});

export type FlightOffer = z.infer<typeof flightOfferSchema>;

const dictionariesSchema = z.object({
  locations: z.record(
    z.object({
      cityCode: z.string(),
      countryCode: z.string(),
    })
  ),
  aircraft: z.record(z.string()),
  currencies: z.record(z.string()),
  carriers: z.record(z.string()),
});

export type Dictionaries = z.infer<typeof dictionariesSchema>;

export function searchFlightsResponseSchema() {
  return z.object({
    meta: z.object({
      count: z.number(),
      links: z.object({
        self: z.string().url(),
      }),
    }),
    data: z.array(flightOfferSchema),
    dictionaries: dictionariesSchema,
  });
}

export type SearchFlightsResponse = z.infer<
  ReturnType<typeof searchFlightsResponseSchema>
>;
