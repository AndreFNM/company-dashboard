"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";

const localizer = momentLocalizer(moment);

export default function ManageHolidaysPage() {
  const [holidays, setHolidays] = useState([]); 
  const [allHolidays, setAllHolidays] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const { data: session } = useSession(); 
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/holidays/see-all");
        if (!response.ok) {
          throw new Error("Error searching for holidays.");
        }
        const data = await response.json();
        setUsers(data.users);
        setAllHolidays(data.holidays);

        if (session) {
          const loggedInUser = data.users.find(user => user.id === parseInt(session.user.id));
          if (loggedInUser) {
            setSelectedUser(loggedInUser); 
            const userHolidays = data.holidays.filter(
              holiday => holiday.userId === loggedInUser.id
            );
            setHolidays(userHolidays); 
          }
        }

        if (!session) {
          setHolidays(data.holidays);
        }
      } catch (error) {
        console.error("Error searching for holidays:", error);
      }
    }
    fetchData();
  }, [session]);

  const handleViewHolidays = (user) => {
    setSelectedUser(user); 
    const userHolidays = allHolidays.filter(
      holiday => holiday.userId === user.id
    );
    setHolidays(userHolidays); 
  };

  const eventStyleGetter = (event: BigCalendarEvent) => {
    const userColor = event.title.includes("Admin") ? "#2196F3" : "#008000"; 
    return {
      style: {
        backgroundColor: userColor,
        color: "white",
        borderRadius: "8px",
        padding: "5px 10px",
        fontSize: "0.9rem",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        margin: "3px", 
        zIndex: 10,
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const isCurrentMonth =
      moment(date).month() === moment(localizer.startOf(new Date(), "month")).month();
    const isPast = moment(date).isBefore(moment(), "day");

    return {
      style: {
        backgroundColor: isCurrentMonth ? "#2D2D2D" : "#111111",
        color: isPast ? "#666" : "#fff",
        pointerEvents: "all",
        opacity: isCurrentMonth ? 1 : 0.5,
      },
    };
  };

  const filteredHolidays = selectedUser
    ? holidays 
    : allHolidays;

  return (
    <ProtectedRoute requiredRole="ADMIN">
    <div className="p-8 sm:ml-64 bg-gray-800 min-h-screen text-white">
      <div className="w-full max-w-full mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Painel de Férias de Todos os Funcionários</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Utilizadores</h2>
          <table className="w-full table-auto border-collapse bg-gray-800 rounded-md overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Cargo</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Férias Marcadas</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-600 bg-gray-900">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.position}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.holidays.length} dias Marcados</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewHolidays(user)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                      Ver Férias
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Calendário de Férias</h2>
          <Calendar
            localizer={localizer}
            events={filteredHolidays}  
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, backgroundColor: "#1E1E1E", borderRadius: "8px" }}
            views={["month"]}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
          />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
