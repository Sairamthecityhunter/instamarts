import React, { useState } from 'react';
import { FiClock, FiTruck } from 'react-icons/fi';

interface TimeSlot {
  id: string;
  time: string;
  label: string;
  available: boolean;
  isExpress?: boolean;
}

interface DeliveryTimeSlotsProps {
  onSelectSlot: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
}

const DeliveryTimeSlots: React.FC<DeliveryTimeSlotsProps> = ({
  onSelectSlot,
  selectedSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate time slots for today and next 7 days
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const isToday = date.toDateString() === new Date().toDateString();
    const currentHour = new Date().getHours();

    // Morning slots (9 AM - 12 PM)
    for (let hour = 9; hour < 12; hour++) {
      if (isToday && hour <= currentHour) continue;
      slots.push({
        id: `${date.toISOString()}-${hour}-morning`,
        time: `${hour}:00`,
        label: `${hour}:00 - ${hour + 1}:00`,
        available: true,
      });
    }

    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      if (isToday && hour <= currentHour) continue;
      slots.push({
        id: `${date.toISOString()}-${hour}-afternoon`,
        time: `${hour}:00`,
        label: `${hour}:00 - ${hour + 1}:00`,
        available: true,
      });
    }

    // Evening slots (5 PM - 9 PM)
    for (let hour = 17; hour < 21; hour++) {
      if (isToday && hour <= currentHour) continue;
      slots.push({
        id: `${date.toISOString()}-${hour}-evening`,
        time: `${hour}:00`,
        label: `${hour}:00 - ${hour + 1}:00`,
        available: true,
      });
    }

    // Express delivery slot (if today and before 2 PM)
    if (isToday && currentHour < 14) {
      slots.unshift({
        id: `${date.toISOString()}-express`,
        time: 'Express',
        label: 'Express Delivery (2-3 hours)',
        available: true,
        isExpress: true,
      });
    }

    return slots;
  };

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const slots = generateTimeSlots(selectedDate);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTruck className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Choose Delivery Time</h3>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getDates().map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="font-medium">{date.getDate()}</div>
                {isToday && <div className="text-xs text-green-600">Today</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
        {slots.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No slots available for this date</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onSelectSlot(slot)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedSlot?.id === slot.id
                    ? 'border-green-600 bg-green-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-green-300'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  {slot.isExpress && <FiClock className="h-4 w-4 text-orange-500" />}
                  <span className={`font-medium ${slot.isExpress ? 'text-orange-600' : 'text-gray-900'}`}>
                    {slot.label}
                  </span>
                </div>
                {slot.isExpress && (
                  <span className="text-xs text-orange-600 mt-1 block">Extra charges apply</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTimeSlots;
