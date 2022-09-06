import { MeetingSlotStatus } from "~/services/mytfo/types"

const availableTimeSlots = [
  {
    time: "09:00:00",
    from: "09:00",
    to: "10:00",
    available: true,
    status: MeetingSlotStatus.Free,
  },
  {
    time: "11:00:00",
    from: "11:00",
    to: "12:00",
    available: true,
    status: MeetingSlotStatus.Free,
  },
  {
    time: "13:00:00",
    from: "13:00",
    to: "14:00",
    available: true,
    status: MeetingSlotStatus.Free,
  },
  {
    time: "15:00:00",
    from: "15:00",
    to: "16:00",
    available: true,
    status: MeetingSlotStatus.Free,
  },
]

export default availableTimeSlots
