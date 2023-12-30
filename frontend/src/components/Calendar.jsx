import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';


const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);


  useEffect(() => {
    const userToken = localStorage.getItem("authToken");
    async function fetchEvents() {
      try {
        const response = await fetch('http://localhost:8080/api/todos/', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          }
        });
        const events = await response.json();
        console.log("events: ", events)
        setCurrentEvents(events);
      } catch (error) {
        console.error('Error during fetching the data...', error);
      }
    }
    fetchEvents()
      .catch(error => console.log(error))
  }, []);


  return (
    <>
      <div className="calendarContainer">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridDay,listWeek',
          }}
          initialView="listWeek"
          slotLabelFormat={{hour: 'numeric', minute: '2-digit', hour12: false}}
          scrollTime="6:00"
          // editable={true}
          // selectable={true}
          // selectMirror={true}
          dayMaxEvents={0}
          events={currentEvents.map((event) => ({
            title: event.name,
            date: event.duedate
          }))}
          eventDisplay='auto'
          eventTimeFormat={{hour:'2-digit', minute:'2-digit', meridiem:false, hour12:false }}
        />
      </div>
    </>
  );
};

export default Calendar;