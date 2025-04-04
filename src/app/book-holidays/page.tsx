"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function BookHolidaysPage() {
  const [date, setDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleSelectEvent = (event: { start: Date; end: Date }) => {
    setDate(event.start);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setDate(start);
    setShowModal(true);
  };

  const handleAddHoliday = () => {
    const newHoliday = {
      title: "Férias",
      start: date,
      end: date,
    };
    setHolidays([...holidays, newHoliday]);
    setShowModal(false);
  };

  const eventStyleGetter = () => {
    const style = {
      backgroundColor: "#4CAF50",
      color: "white",
      borderRadius: "5px",
    };
    return {
      style,
    };
  };

  const dayPropGetter = (date) => {
    const isToday = moment(date).isSame(moment(), "day");
    const isCurrentMonth = moment(date).month() === moment(date).startOf("month").month();

    const style = {
      backgroundColor: isCurrentMonth ? "#1E1E1E" : "#111111",
      color: "#fff",
      border: isToday ? "1px solid #4CAF50" : "none",
    };

    return { style };
  };

  return (
    <div className="p-16 sm:ml-64 bg-gray-900 min-h-screen">
      <div className="w-full max-w-full mx-auto">
        <Calendar
          localizer={localizer}
          events={holidays}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, backgroundColor: "#1E1E1E", color: "#fff" }}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter} 
          views={['month']}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-md w-96">
            <h2 className="text-2xl text-white mb-4">Marcar Férias</h2>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleAddHoliday}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Marcar Férias
        </button>
      </div>
    </div>
  );
}
