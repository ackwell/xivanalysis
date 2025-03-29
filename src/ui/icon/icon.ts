import {ClockArrowDown, Globe, RefreshCw} from "lucide-react"
import Healer from './svg/healer.inline.svg'
import MagicalRanged from './svg/magical-ranged.inline.svg'
import Melee from './svg/melee.inline.svg'
import PhysicalRanged from './svg/physical-ranged.inline.svg'
import Tank from './svg/tank.inline.svg'
import {wrapIcon} from "./wrap"

export const IconGlobe = wrapIcon(Globe)
export const IconRefresh = wrapIcon(RefreshCw)
export const IconOutdated = wrapIcon(ClockArrowDown)

export const IconHealer = wrapIcon(Healer)
export const IconMagicalRanged = wrapIcon(MagicalRanged)
export const IconMelee = wrapIcon(Melee)
export const IconPhysicalRanged = wrapIcon(PhysicalRanged)
export const IconTank = wrapIcon(Tank)
