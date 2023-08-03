import "./dropdown.css"
import { CostTable } from "./CostTable"
import { Dropdown } from "./Dropdown"
import { CHAINS } from "~/features/data/chains"

interface Props {
  placeholder?: string
  method: "vrfSubscription" | "vrfDirectFunding"
}

export const DropDownMenu = ({ placeholder = "Select a network...", method }: Props) => {
  const options = CHAINS.filter((chain) => chain.supportedFeatures.includes(method))
  return (
    <div className="main-container">
      <Dropdown placeholder={placeholder} options={options} />
      <CostTable method={method} />
    </div>
  )
}
