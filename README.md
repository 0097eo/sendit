# SendIT Courier Service

**SendIT** is a courier service platform that allows users to send parcels to different destinations. Users can create parcel delivery orders, track their orders, and make modifications as needed, while admins can manage and update parcel delivery statuses.

---

## Table of Contents
- [Team](#team)
- [Tech Stack](#tech-stack)
- [MVP Features](#mvp-features)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Team
- **Full Stack**: React (Frontend) & Flask (Backend)

---

## Tech Stack
- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Database**: SQL (or as required)
- **Version Control**: Git

---

## MVP Features

1. **User Authentication**
   - Users can create an account and log in to access the platform.
   
2. **Parcel Management**
   - Users can create a new parcel delivery order by specifying details like destination and weight.
   
3. **Change Parcel Destination**
   - Users can modify the destination of a parcel, provided the parcel is not yet marked as "Delivered."
   
4. **Cancel Parcel Delivery**
   - Users can cancel a parcel delivery order before it is marked as "Delivered."
   
5. **View Parcel Details**
   - Users can view the full details of their parcel delivery orders, including status and location.

6. **Admin Capabilities**
   - Admin users can update the status of parcel deliveries and set the current location of parcels in transit.

---


## How to Run the Application

### Prerequisites
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Python](https://www.python.org/) (version 3.6 or higher)
- [Flask](https://flask.palletsprojects.com/)
- A compatible SQL database (e.g., SQLite, PostgreSQL)

## Setup

1. **Clone the Repository**

   ```
   git clone https://github.com/0097eo/sendit
   ```
2. **Install dependencies**
   - backend
   ```
   pipenv install
   ```
   - frontend
   ```
   npm i
   ```
3. **Activate the virtual environment**

   ```
   pipenv shell
   ```
   
3. **Setup the database**

   ```
   flask db init
   ```

   ```
   flask db migrate
   ```

   ```
   flask db upgrade
   ```

4. **Seed the database**

   ```
   python seed.py
   ```
6. **Run the application**
   server
   ```
   python app.py
   ```
   client
   ```
   npm run dev
   ```
---

## Usage

Once both the frontend and backend servers are running, you can access the application through your browser.
- Users can sign up, log in, and create parcel orders.
- Admin users can log in to manage and update parcel statuses and locations.

---

## Contributing

Contributions are welcome! Please follow the steps below to contribute to this project:
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Push the changes to your fork (git push origin feature-branch).
- Open a pull request.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) 
