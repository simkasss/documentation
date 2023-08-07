import { useState, useCallback, useEffect } from "preact/hooks"
type SearchParamValue = string | string[]

const setQueryStringWithoutPageReload = (qsValue) => {
  if (typeof window === "undefined") return

  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qsValue

  window.history.replaceState({ path: newurl }, "", newurl)
}
export const setQueryStringValue = (searchParamKey, value: SearchParamValue) => {
  if (typeof window === "undefined") return

  const currentSearchParams = new URLSearchParams(window.location.search)
  if (typeof value !== "string") {
    currentSearchParams.delete(searchParamKey)
    value.forEach((val) => {
      currentSearchParams.append(searchParamKey, val)
    })
  } else {
    currentSearchParams.set(searchParamKey, value)
  }
  setQueryStringWithoutPageReload(`?${currentSearchParams.toString()}`)
  const after = getQueryStringValue(searchParamKey)
  return after
}
export const getQueryStringValue = (searchParamKey: string): null | string | string[] => {
  if (typeof window === "undefined") return null
  const values = new URLSearchParams(window.location.search).getAll(searchParamKey)
  return values.length > 1 ? values : values[0]
}

function useQueryString(
  searchParamKey: string,
  initialValue?: SearchParamValue
): [SearchParamValue, (newValue: SearchParamValue) => void] {
  const [value, setValue] = useState<string | string[]>(getQueryStringValue(searchParamKey) || initialValue)
  // Keep URL in sync when memory is updated using initial value.
  useEffect(() => {
    if (value && !getQueryStringValue(searchParamKey)) {
      setQueryStringValue(searchParamKey, initialValue)
    }
  }, [])

  const onSetValue = useCallback(
    (newValue: string | string[]) => {
      setValue(newValue)
      setQueryStringValue(searchParamKey, newValue)
    },
    [searchParamKey]
  )
  // Keep memory in sync when search params are updated.
  useEffect(() => {
    const body = document.querySelector("body")
    const observer = new MutationObserver(() => {
      const newQueryStringValue = getQueryStringValue(searchParamKey)
      if (newQueryStringValue !== value && newQueryStringValue) {
        setValue(newQueryStringValue)
      }
    })
    observer.observe(body, { childList: true, subtree: true })
  }, [])

  return [value, onSetValue]
}

export default useQueryString
