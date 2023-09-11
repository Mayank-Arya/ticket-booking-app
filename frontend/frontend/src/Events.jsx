// import React, { useState, useEffect } from "react";
// import "./Events.css"; // You can create a CSS file for styling

// function Events() {
//   const [events, setEvents] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     // Fetch events data when the component mounts
//     fetchEvents();
//   }, []);

//   function formatDate(dateString) {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   }


//   const fetchEvents = async () => {
//     try {
//       const response = await fetch("http://localhost:9090/event/all", {
//         headers: {
//           Authorization: `${token}`, // Include the authentication token
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setEvents(data); // Assuming the response structure has an "events" property
//       } else {
//         console.error("Failed to fetch events.");
//       }
//     } catch (error) {
//       console.error("Error during fetchEvents:", error);
//     }
//   };

//   // Function to handle booking an event
//   const handleBookEvent = async (eventId) => {
//     try {
//       // Make an API request to book the event
//       const response = await fetch(`http://localhost:9090/ticket`, {
//         method: "POST",
//         headers: {
//           Authorization: `${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ eventId }), // Send the eventId in the request body
//       });
  
//       if (response.ok) {
//         // Handle success (e.g., display a success message)
//         console.log("Event booked successfully!");
//       } else {
//         console.error("Failed to book event.");
//       }
//     } catch (error) {
//       console.error("Error during event booking:", error);
//     }
//   };
  

//   return (
//     <div className="events">
//       {/* Navbar */}
//       <nav className="navbar">
//         {/* Left side */}
//         <div className="left">
//           <img src="/bookit.png" alt="App Logo" />
//           <span>BookmyEvent</span>
//         </div>
//         {/* Right side */}
//         <div className="right">
//           <button className="events-button">Events</button>
//           <button className="profile-button">My Profile</button>
//         </div>
//       </nav>

//       {/* Event cards */}
//       <div className="event-cards">
//         {events.map((event) => (
//           <div key={event.id} className="event-card">
//             <h2>{event.title}</h2>
//             <p>{event.description}</p>
//             <p>Date: {formatDate(event.date)}</p>
//             <p>Venue: {event.venue}</p>
//             <p>Price: ${event.price}</p>
//             <button
//               className="book-button"
//               onClick={() => handleBookEvent(event._id)}
//             >
//               Book
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Events;


import React, { useState, useEffect } from "react";
import "./Events.css"; // You can create a CSS file for styling

function Events() {
  const [events, setEvents] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAlreadyBookedPopup, setShowAlreadyBookedPopup] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch events data when the component mounts
    fetchEvents();
  }, []);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:9090/event/all", {
        headers: {
          Authorization: `${token}`, // Include the authentication token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data); // Assuming the response structure has an "events" property
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error during fetchEvents:", error);
    }
  };

  // Function to handle booking an event
  const handleBookEvent = async (eventId) => {
    try {
      // Make an API request to book the event
      const response = await fetch(`http://localhost:9090/ticket`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }), // Send the eventId in the request body
      });
  
      if (response.ok) {
        // Handle success by showing the success pop-up
        setShowSuccessPopup(true);
      } else if (response.status === 409) {
        // If the status is 409 (Conflict), it means the event is already booked
        // Show the already booked pop-up
        setShowAlreadyBookedPopup(true);
      } else {
        console.error("Failed to book event.");
      }
    } catch (error) {
      console.error("Error during event booking:", error);
    }
  };

  return (
    <div className="events">
      {/* Navbar */}
      <nav className="navbar">
        {/* Left side */}
        <div className="left">
          <img src="/bookit.png" alt="App Logo" />
          <span>BookmyEvent</span>
        </div>
        {/* Right side */}
        <div className="right">
          <button className="events-button">Events</button>
          <button className="profile-button">My Profile</button>
        </div>
      </nav>

      {/* Event cards */}
      <div className="event-cards">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {formatDate(event.date)}</p>
            <p>Venue: {event.venue}</p>
            <p>Price: ${event.price}</p>
            <button
              className="book-button"
              onClick={() => handleBookEvent(event._id)}
            >
              Book
            </button>
          </div>
        ))}
      </div>

      {/* Success Pop-up */}
      {showSuccessPopup && (
        <div className="popup success-popup">
          <p>Event booked successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}

      {/* Already Booked Pop-up */}
      {showAlreadyBookedPopup && (
        <div className="popup error-popup">
          <p>Event is already booked!</p>
          <button onClick={() => setShowAlreadyBookedPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Events;
