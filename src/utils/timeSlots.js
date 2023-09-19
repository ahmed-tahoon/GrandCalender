export default function timeSlots(minuteSlot = 15) {
  const times = [];
  let hour = 12;
  let minute = 0;
  let ampm = 'AM';

  const timeSlotsCount = 24 * (60 / minuteSlot);

  for (let i = 0; i < timeSlotsCount; i++) {
    const timeValue = i + 1;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    times.push({value: timeValue, label: time});
    minute += minuteSlot;
    if (minute === 60) {
      minute = 0;
      hour++;
      if (hour === 12) {
        ampm = ampm === 'AM' ? 'PM' : 'AM';
      } else if (hour === 13) {
        hour = 1;
      }
    }
  }

  return times;
}