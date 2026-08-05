import {
  Anchor,
  AirplaneTilt,
  Certificate,
  ChatsCircle,
  Clock,
  GlobeHemisphereEast,
  Headset,
  MapPin,
  NotePencil,
  Package,
  Gps,
  SealCheck,
  ShieldCheck,
  Truck,
  UsersThree,
  Warehouse,
} from '@phosphor-icons/react'

const iconMap = {
  Anchor,
  AirplaneTilt,
  Certificate,
  ChatsCircle,
  Clock,
  GlobeHemisphereEast,
  Headset,
  MapPin,
  NotePencil,
  Package,
  Gps,
  SealCheck,
  ShieldCheck,
  Truck,
  UsersThree,
  Warehouse,
}

// mock 数据中的图标名字符串 → 图标组件
export default function DynIcon({ name, ...props }) {
  const Icon = iconMap[name] || Package
  return <Icon {...props} />
}
