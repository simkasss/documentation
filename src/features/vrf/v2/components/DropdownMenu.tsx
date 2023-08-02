import "./dropdown.css"
import { CostTable } from "./CostTable"
import { Dropdown } from "./Dropdown"

interface Props {
  placeholder?: string
  method: "vrfSubscription" | "vrfDirectFunding"
}

export const DropDownMenu = ({ placeholder = "Select a network...", method }: Props) => {
  return (
    <div className="main-container">
      <Dropdown placeholder={placeholder} method={method} />
      <CostTable method={method} />
    </div>
  )
}
