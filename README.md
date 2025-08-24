Features
REST API for Chat and FAQ management
Upload and parse PDF files to extract FAQs
Store FAQs in MongoDB
Simple API endpoints to interact with the system

🛠️ Tech Stack
Runtime: Node.js (Express.js)
Database: MongoDB (Mongoose ODM)
Other: pdf-parse for reading PDF files

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/nithinragutla/spotimies-companytask-backendcode.git
cd spotimies-companytask-backendcode

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables
Create a .env file in the root of the project and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_openai_api_key   # only if AI features are used

4️⃣ Run the server
node server.js

Server will run at:
👉 http://localhost:5000

📌 API Endpoints
Chat API
POST /api/chat → Send a message to chat

FAQ API
POST /api/faq/upload → Upload a PDF file containing FAQs
GET /api/faq → Get all FAQs

🗄️ Database
This project uses MongoDB as the database.

You can connect either to MongoDB Atlas (cloud) or your local MongoDB instance.

Data like FAQs and Chats are stored in MongoDB collections.
