import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [userEvents, setUserEvents] = useState([]);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const token = localStorage.getItem("token");

  // Track which event is being edited
  const [editingEvent, setEditingEvent] = useState(null);

  // Track changes to event fields
  const [editedFields, setEditedFields] = useState({});

  // Fetch user data, user events, and scheduled events when the component mounts
  useEffect(() => {
    if (token) {
      // Fetch user data
      fetchUserData(token);

      // Fetch user's created events
      fetchUserEvents(token);

      // Fetch user's scheduled events
      fetchScheduledEvents(token);
    }
  }, [token]);

  // Function to fetch user data

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Function to fetch user's created events
  const fetchUserEvents = async (token) => {
    try {
      const response = await fetch("http://localhost:9090/event", {
        headers: {
          Authorization: `${token}`, // Include the authentication token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEvents(data.userEvents); // Assuming the response structure has a "userEvents" property
      } else {
        console.error("Failed to fetch user events.");
      }
    } catch (error) {
      console.error("Error during fetchUserEvents:", error);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:9090/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchScheduledEvents = async (token) => {
    try {
      const response = await fetch("http://localhost:9090/ticket/user", {
        headers: {
          Authorization: `${token}`, // Include the authentication token with "Bearer" prefix
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setScheduledEvents(data.userTickets); // Assuming the response structure has a "userTickets" property
        console.log(data);
      } else {
        console.error("Error fetching scheduled events");
      }
    } catch (error) {
      console.error("Error fetching scheduled events:", error);
    }
  };

  // Function to handle the Edit button click
  const handleEditClick = (event) => {
    // Set the event being edited
    setEditingEvent(event);

    // Initialize edited fields with the current event details
    setEditedFields({
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue,
    });
  };

  // Function to handle changes in the input fields
  const handleFieldChange = (field, value) => {
    setEditedFields({
      ...editedFields,
      [field]: value,
    });
  };

  // Function to handle the Save button click
  const handleSaveClick = async () => {
    try {
      // Make an API request to update the event
      const response = await fetch(
        `http://localhost:9090/event/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedFields),
        }
      );

      if (response.ok) {
        // Update the event details in the userEvents state
        setUserEvents((prevUserEvents) =>
          prevUserEvents.map((event) =>
            event.id === editingEvent.id ? { ...event, ...editedFields } : event
          )
        );

        // Clear the editing state
        setEditingEvent(null);
        setEditedFields({});

        // Reload the page
        window.location.reload();
      } else {
        console.error("Failed to update event.");
      }
    } catch (error) {
      console.error("Error during event update:", error);
    }
  };

  // Function to handle the Delete button click
  const handleDeleteClick = async (eventId) => {
    try {
      // Make an API request to delete the event
      const response = await fetch(`http://localhost:9090/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        // Remove the event from the userEvents state
        setUserEvents((prevUserEvents) =>
          prevUserEvents.filter((event) => event.id !== eventId)
        );

        // Reload the page
        window.location.reload();
      } else {
        console.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error during event deletion:", error);
    }
  };

  const handleCancelEventClick = async (eventId) => {
    try {
      // Make an API request to cancel the event
      const response = await fetch(`http://localhost:9090/ticket/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        // Remove the event from the scheduledEvents state
        setScheduledEvents((prevScheduledEvents) =>
          prevScheduledEvents.filter((ticket) => ticket.event?.id !== eventId)
        );

        // Reload the page
        window.location.reload();
      } else {
        console.error("Failed to cancel event.");
      }
    } catch (error) {
      console.error("Error during event cancellation:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        {/* Left side */}
        <div className="left">
          <img src="/bookit.png" alt="App Logo" />
          <span>BookmyEvent</span>
        </div>
        {/* Right side */}
        <div className="right">
          <Link to='/events'><button href='/events' className="events-button">Events</button></Link>
          <Link to='/profile'><button className="profile-button">My Profile</button></Link>
          <span>{userData.name}</span>
        </div>
      </nav>

      {/* Dashboard content */}
      <div className="dashboard-content">
        {/* Left div (User-created events) */}
        <div className="left-div">
  <h1>My Events</h1>
  {/* Check if there are userEvents */}
  {userEvents.length === 0 ? (
    <p>No events available.</p>
  ) : (
    // Map over userEvents and display them
    userEvents.map((event) => (
      <div key={event.id} className="event-item">
        {/* Display event details */}
        {event === editingEvent ? (
          <>
            <input
              type="text"
              value={editedFields.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
            <input
              type="text"
              value={editedFields.description || ""}
              onChange={(e) =>
                handleFieldChange("description", e.target.value)
              }
            />
            <input
              type="text"
              value={editedFields.date || ""}
              onChange={(e) => handleFieldChange("date", e.target.value)}
            />
            <input
              type="text"
              value={editedFields.venue || ""}
              onChange={(e) => handleFieldChange("venue", e.target.value)}
            />
            <button onClick={handleSaveClick}>Save</button>
          </>
        ) : (
          <>
            <h3>{event.title ? event.title : "No Title"}</h3>
            <p className="first-p">
              {event.description ? event.description : "No Description"}
            </p>
            <p className="second-p">
              On {event.date ? formatDate(event.date) : "No Date"}
            </p>
            <p className="third-p">
             Venue : {event.venue ? event.venue : "No Venue"}
            </p>
            <p className="third-p">
              price : $ {event.price? event.price: "No Price"}
            </p>
            <div className="but-div">
              <button
                className="Edit"
                onClick={() => handleEditClick(event)}
              >
                Edit
              </button>
              <button
                className="Delete"
                onClick={() => handleDeleteClick(event._id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
        {/* Add more event details as needed */}
      </div>
    ))
  )}
</div>

<div className="right-div">
  <h1>My Scheduled Events</h1>
  {/* Check if there are scheduledEvents */}
  {scheduledEvents.length === 0 ? (
    <p>No scheduled events available.</p>
  ) : (
    // Map over scheduledEvents and display them
    scheduledEvents.map((ticket) => (
      // Render scheduled event item
      <div key={ticket.event?.id} className="event-item">
        {/* Display scheduled event details */}
        <p>ticket</p>
        <h3>{ticket.event?.title}</h3>
        <p className="first-p">{ticket.event?.description}</p>
        <p className="second-p">
          {ticket.event?.date ? formatDate(ticket.event.date) : "No Date"}
        </p>
        {/* Add the Cancel Event button */}
        <button
          className="Cancel"
          onClick={() => handleCancelEventClick(ticket._id)}
        >
          Cancel Event
        </button>
        {/* Add more scheduled event details as needed */}
      </div>
    ))
  )}
</div>

      </div>
    </div>
  );
}

export default Dashboard;
