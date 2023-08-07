import { expect, jest, beforeAll } from "@jest/globals"
import { getQueryStringValue, setQueryStringValue } from "./useQueryString"

describe("getQueryStringValue", () => {
  beforeAll(() => {
    const location = {
      search: "?categories=monitored&categories=specialized",
    }
    const mockReplaceState = (_data, _, newurl: string) => {
      location.search = newurl.split("?")[1]
    }
    Object.defineProperty(globalThis, "window", {
      value: {
        location,
        history: {
          replaceState: jest.fn().mockImplementation(mockReplaceState),
        },
      },
    })
  })
  test("getQueryStringValue - returns an array of values when multiple values are present", () => {
    expect(getQueryStringValue("categories")).toEqual(["monitored", "specialized"])
  })
  test("setQueryStringValue - adds a value to the array of values", () => {
    expect(setQueryStringValue("categories", ["monitored", "specialized", "provisional"])).toEqual([
      "monitored",
      "specialized",
      "provisional",
    ])
  })
  test("setQueryStringValue - removes a value from the array of values, returns a string if there is only one value", () => {
    expect(setQueryStringValue("categories", ["monitored"])).toEqual("monitored")
  })
})
