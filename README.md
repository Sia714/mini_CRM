# Mini CRM — Campaign Management Platform

Mini CRM is a full-featured Customer Relationship Management platform built with the MERN stack, allowing users to create dynamic customer segments, send campaigns with AI-generated messages, and track delivery performance — all within a modern, intuitive UI.

---

##  Features

-  **Customer Segmentation** with drag-and-drop rule builder (AND/OR logic)
-  **Campaign Creation** with AI-powered message suggestions, which are based on Segment Info (OpenRouter GPT-4o-mini)
-  **Simulated Vendor API** for message delivery + async receipt handling
-  **Delivery Metrics** (sent/failed counts auto-updated)
-  **Google OAuth 2.0 Authentication**
-  **RESTful API Design** with MongoDB and Mongoose

---

##  Tech Stack

| Layer         | Technology                        |
|---------------|------------------------------------|
| Frontend      | React + Vite + Material UI (MUI)   |
| Backend       | Node.js + Express                  |
| Database      | MongoDB with Mongoose              |
| Authentication| Google OAuth 2.0 + Express-Session |
| AI Integration| OpenRouter API (GPT-4o-mini)       |
| Delivery Sim  | Custom Vendor API  |

---

##  Installation

```bash

git clone https://github.com/Sia714/mini_CRM.git
cd mini-crm
````

### Backend

```bash
cd backend
npm install

# Fill in Mongo URI and Google OAuth credentials in .env
nodemon server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` file in the backend with the following:

```
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

##  Key Functionalities

### Segment Rule Builder

* Construct audience logic using **drag-and-drop**
* Supports nested **AND/OR** groups
* Rules stored and evaluated server-side using MongoDB queries

### AI Campaign Messages

* Campaign creation includes an **AI suggestion tool**
* Powered by **OpenRouter’s GPT-4o-mini**
* Auto-generates personalized marketing messages based on campaign context

###  Vendor Delivery Simulation

* `/vendor/send-message` accepts messages and simulates 90% delivery success
* Delays introduced to mimic real-world async messaging
* Callback to `/vendor/delivery-receipt` updates message status and campaign counts

###  Google OAuth Login

* Google login via OAuth 2.0
* User info stored in session and passed to frontend
* Middleware protects private routes

---


##  To-Do / Improvements

* [ ] Pagination and search for large customer datasets
* [ ] WebSocket or SSE for real-time delivery status updates
* [ ] Advanced analytics (CTR, conversion tracking, etc.)

---

##  Credits

Built with  by Sayjan J. Singh (B.Tech CSE Hons.— Full Stack Software Development)

---

##  License

MIT License. Free to use, fork, and modify.

```
