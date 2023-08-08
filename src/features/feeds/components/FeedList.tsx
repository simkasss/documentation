/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks"
import { MainnetTable, TestnetTable } from "./Tables"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib"
import { updateTableOfContents } from "~/components/RightSidebar/TableOfContents/tocStore"
import { Chain, CHAINS, ALL_CHAINS } from "~/features/data/chains"
import { useGetChainMetadata } from "./useGetChainMetadata"
import { ChainMetadata } from "../../data/api"
import useQueryString from "~/hooks/useQueryString"

export type DataFeedType = "default" | "por" | "nftFloor" | "rates"
export const FeedList = ({
  dataFeedType = "default",
  ecosystem = "",
  initialCache,
}: {
  initialNetwork: string
  dataFeedType: DataFeedType
  ecosystem?: string
  initialCache?: Record<string, ChainMetadata>
}) => {
  const chains = ecosystem === "deprecating" ? ALL_CHAINS : CHAINS

  const [selectedChain, setSelectedChain] = useQueryString("network", chains[0].page)
  const [showExtraDetails, setShowExtraDetails] = useState(false)

  const chainMetadata = useGetChainMetadata(chains.filter((chain) => chain.page === selectedChain)[0], { initialCache })

  function handleNetworkSelect(chain: Chain) {
    setSelectedChain(chain.page)
  }
  useEffect(() => {
    setSelectedChain("ethereum")
  }, [])

  useEffect(() => {
    updateTableOfContents()
  }, [chainMetadata.processedData])

  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isRates = dataFeedType === "rates"
  const isDeprecating = ecosystem === "deprecating"
  let netCount = 0

  return (
    <>
      <div className="content" style={{ marginTop: "var(--space-4x)" }}>
        <section>
          {!isDeprecating && (
            <div class={feedList.clChainnavProduct} id="networks-list">
              <div>
                <div role="tablist">
                  {chains
                    .filter((chain) => {
                      if (isPor) return chain.tags?.includes("proofOfReserve")

                      if (isNftFloor) return chain.tags?.includes("nftFloorPrice")

                      if (isRates) return chain.tags?.includes("rates")

                      return chain.tags?.includes("default")
                    })
                    .map((chain) => (
                      <button
                        key={chain.page}
                        id={chain.page}
                        role="tab"
                        aria-selected={selectedChain === chain.page}
                        class={clsx(feedList.networkSwitchButton)}
                        onClick={() => handleNetworkSelect(chain)}
                      >
                        <img src={chain.img} title={chain.label} loading="lazy" width={32} height={32} />
                        <span>{chain.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {chainMetadata.processedData?.networkStatusUrl && !isDeprecating && (
            <p>
              Track the status of this network at{" "}
              <a href={chainMetadata.processedData?.networkStatusUrl}>
                {chainMetadata.processedData?.networkStatusUrl}
              </a>
            </p>
          )}

          {chainMetadata.error && <p>There was an error loading the feeds...</p>}

          {chainMetadata.loading && !chainMetadata.processedData && <p>Loading...</p>}

          {chainMetadata.processedData?.networks
            .filter((network) => {
              if (isDeprecating) {
                let foundDeprecated = false
                network.metadata?.forEach((feed) => {
                  if (feed.docs?.shutdownDate) {
                    foundDeprecated = true
                    netCount++
                  }
                })
                return foundDeprecated
              }

              if (isPor) return network.tags?.includes("proofOfReserve")

              if (isNftFloor) return network.tags?.includes("nftFloorPrice")

              if (isRates) return network.tags?.includes("rates")

              return true
            })
            .map((network) => (
              <>
                {network.networkType === "mainnet" ? (
                  <div key={network.name}>
                    <h2 id={network.name}>
                      {network.name}{" "}
                      <a className="anchor" href={`#${network.name}`}>
                        <img src="/images/link.svg" alt="Link to this section" />
                      </a>
                    </h2>
                    {(selectedChain === "arbitrum" || selectedChain === "optimism" || selectedChain === "metis") && (
                      <p>
                        {network.name} is an L2 network. As a best practice, use the L2 sequencer feed to verify the
                        status of the sequencer when running applications on L2 networks. See the{" "}
                        <a href="/docs/data-feeds/l2-sequencer-feeds/">L2 Sequencer Uptime Feeds</a> page for examples.
                      </p>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        style="width:15px;height:15px;display:inline;"
                        checked={showExtraDetails}
                        onChange={() => setShowExtraDetails((old) => !old)}
                      />{" "}
                      Show more details
                    </label>
                    <MainnetTable
                      network={network}
                      showExtraDetails={showExtraDetails}
                      dataFeedType={dataFeedType}
                      ecosystem={ecosystem}
                    />
                  </div>
                ) : (
                  <div key={network.name}>
                    <h2 id={network.name}>
                      {network.name}{" "}
                      <a className="anchor" href={`#${network.name}`}>
                        <img src="/images/link.svg" alt="Link to this section" />
                      </a>
                    </h2>
                    <label>
                      <input
                        type="checkbox"
                        style="width:15px;height:15px;display:inline;"
                        checked={showExtraDetails}
                        onChange={() => setShowExtraDetails((old) => !old)}
                      />{" "}
                      Show more details
                    </label>
                    <TestnetTable network={network} showExtraDetails={showExtraDetails} dataFeedType={dataFeedType} />
                  </div>
                )}
              </>
            ))}
          {isDeprecating && netCount === 0 && (
            <div>
              <strong>No data feeds are scheduled for deprecation at this time.</strong>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
