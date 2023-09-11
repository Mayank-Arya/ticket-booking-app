import React, { useState, useEffect } from "react";
import "./Events.css"; 
import { Link } from "react-router-dom";
import UserProfileModel from "./UserProfileModel";

function Events() {
  const [events, setEvents] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAlreadyBookedPopup, setShowAlreadyBookedPopup] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [user, setUser] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);


  const openUserProfileModal = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    setShowUserProfileModal(true);
  };

  const closeUserProfileModal = () => {
    setShowUserProfileModal(false);
  };



  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://ticket-a8ez.onrender.com/event/all", {
        headers: {
          Authorization: `${token}`, // Include the authentication token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data); 
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
      // Fetch the user's booked tickets
      const response = await fetch(`https://ticket-a8ez.onrender.com/ticket/user`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch user tickets.");
        return;
      }
  
      const data = await response.json();
      const userTickets = data.userTickets;
  
      const isAlreadyBooked = userTickets.some((ticket) => ticket.event._id === eventId);
  
      if (isAlreadyBooked) {
        setShowAlreadyBookedPopup(true);
      } else {
        const bookResponse = await fetch(`https://ticket-a8ez.onrender.com/ticket`, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        });
  
        if (bookResponse.ok) {
          setShowSuccessPopup(true);
        } else {
          console.error("Failed to book event.");
        }
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
          <Link to={"/dashboard"}><img src="data:image/jpeg;base64,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" alt="App" /></Link>
          <span>BookmyEvent</span>
        </div>
        {/* Right side */}
        <div className="right">
          <button className="events-button">Events</button>
          <Link to="/create"> <button className="events-button">Create Events</button></Link>
          <button onClick={openUserProfileModal} className="profile-button">My Profile</button>
          
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

      {showUserProfileModal && (
        <UserProfileModel
          user={user}
          onClose={closeUserProfileModal}
        />
      )}
    </div>
  );
}

export default Events;
