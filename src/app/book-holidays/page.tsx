"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  Event,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

type Holiday = {
  date: string;
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: string;
};

export default function BookHolidaysPage() {
  const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const selectedEvents: CalendarEvent[] = selectedDates.map((date) => ({
    title: "Selecionado",
    start: date,
    end: date,
    allDay: true,
    resource: "selected",
  }));

  const handleDateClick = (date: Date) => {
    const today = moment().startOf("day");
    const clicked = moment(date).startOf("day");

    if (clicked.isBefore(today)) return;

    setSelectedDates((prev) => {
      const alreadySelected = prev.some((d) => moment(d).isSame(date, "day"));
      return alreadySelected
        ? prev.filter((d) => !moment(d).isSame(date, "day"))
        : [...prev, date];
    });
  };

  const handleConfirmSelectedDates = async () => {
    if (selectedDates.length === 0) return;

    const res = await fetch("/api/holidays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: selectedDates }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    const newHolidays = selectedDates.map((date) => ({
      title: "Férias",
      start: new Date(date),
      end: new Date(date),
      allDay: true,
    }));

    setHolidays([...holidays, ...newHolidays]);
    setSelectedDates([]);
    alert("Férias marcadas com sucesso!");
  };

  const removeHoliday = async (date: Date) => {
    const res = await fetch("/api/holidays", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Erro ao remover férias.");
      return;
    }

    setHolidays((prev) =>
      prev.filter((h) => !moment(h.start).isSame(date, "day"))
    );

    alert("Férias removidas com sucesso.");
  };

  const handleSelectedEventClick = (event: CalendarEvent) => {
    const isSelected = event.resource === "selected";
    const isHoliday = event.title === "Férias";

    const eventDate = moment(event.start).startOf("day");
    const today = moment().startOf("day");

    if (isSelected) {
      setSelectedDates((prev) =>
        prev.filter((d) => !moment(d).isSame(event.start, "day"))
      );
      return;
    }

    if (isHoliday && eventDate.isBefore(today)) {
      alert("Não é possível remover férias que já passaram.");
      return;
    }

    if (isHoliday) {
      const confirmRemove = confirm("Pretende remover este dia de férias?");
      if (!confirmRemove) return;
      removeHoliday(event.start);
    }
  };

  const eventStyleGetter = (event: Event) => {
    if ((event as CalendarEvent).resource === "selected") {
      return {
        style: {
          backgroundColor: "#4CAF50",
          opacity: 0.6,
          border: "none",
          borderRadius: "4px",
          margin: 0,
          height: "100%",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };
    }

    return {
      style: {
        backgroundColor: "#2196F3",
        color: "white",
        borderRadius: "5px",
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const isCurrentMonth =
      moment(date).month() === moment(localizer.startOf(new Date(), "month")).month();
    const isPast = moment(date).isBefore(moment(), "day");

    return {
      style: {
        backgroundColor: isCurrentMonth ? "#1E1E1E" : "#111111",
        color: isPast ? "#666" : "#fff",
        pointerEvents: "all",
      },
    };
  };

  useEffect(() => {
    async function fetchHolidays() {
      const res = await fetch("/api/holidays/search");

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro:", errorText);
        return;
      }

      const data = await res.json();

      const fetched = data.holidays.map((h: Holiday) => ({
        title: "Férias",
        start: new Date(h.date),
        end: new Date(h.date),
        allDay: true,
      }));

      setHolidays(fetched);
    }

    fetchHolidays();
  }, []);

  return (
    <div className="p-16 sm:ml-64 bg-gray-800 min-h-screen text-white">
      <div className="w-full max-w-full mx-auto">
        <Calendar
          localizer={localizer}
          events={[...holidays, ...selectedEvents]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, backgroundColor: "#1E1E1E" }}
          selectable={true}
          onSelectSlot={(slot: SlotInfo) => handleDateClick(slot.start)}
          onSelectEvent={handleSelectedEventClick}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          views={["month"]}
        />
      </div>

      {selectedDates.length > 0 && (
        <div className="text-center mt-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            onClick={handleConfirmSelectedDates}
          >
            Confirmar {selectedDates.length} dia(s) de férias
          </button>
        </div>
      )}
    </div>
  );
}
