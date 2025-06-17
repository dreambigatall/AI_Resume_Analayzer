Here's a comprehensive README for your GitHub project, designed to be informative and engaging for potential users and contributors:

```markdown
# AI Resume Analyzer for Recruiters

## 🚀 Project Overview

The AI Resume Analyzer is a powerful full-stack application designed to streamline the recruitment process by intelligently analyzing resumes. Built specifically for recruiters, this tool leverages artificial intelligence to quickly extract key information, identify relevant skills, and match candidates to job requirements, significantly reducing manual effort and accelerating hiring decisions.

## ✨ Features

*   **Intelligent Resume Parsing**: Automatically extracts critical information such as contact details, work experience, education, and skills from various resume formats.
*   **AI-Powered Skill Matching**: Utilizes AI to identify and categorize skills, allowing recruiters to quickly find candidates with the precise competencies needed for a role.
*   **Customizable Job Requirement Matching**: Define specific job criteria and let the AI compare them against candidate resumes for best-fit recommendations.
*   **Candidate Scoring & Ranking**: Provides a quantitative score for each resume based on its relevance to a job description, enabling efficient candidate ranking.
*   **User-Friendly Interface**: An intuitive dashboard for recruiters to upload resumes, view analysis results, and manage candidate pipelines.
*   **Secure Data Handling**: Ensures the privacy and security of sensitive candidate data.
*   **Scalable Architecture**: Designed to handle a growing volume of resumes and users.

## 🛠️ Technologies Used

This project is built with a modern and robust full-stack architecture:

*   **Backend**:
    *   **Node.js**: A powerful JavaScript runtime for building scalable network applications.
    *   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
    *   **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
*   **Database**:
    *   **MongoDB**: A NoSQL document database used for flexible and scalable data storage (e.g., storing parsed resume data, user information).
    *   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, and real-time subscriptions. Used for user authentication, authorization, and potentially other structured data.
*   **Frontend**: (Assumed, as it's a fullstack app. You might want to specify if you used React, Angular, Vue, etc. For now, I'll keep it generic or you can add it later.)
    *   Modern JavaScript Framework (e.g., React, Vue, Angular - *Please specify if applicable*)
    *   TypeScript

## ⚙️ Installation & Setup

Follow these steps to get the AI Resume Analyzer up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   MongoDB Atlas account or local MongoDB instance
*   Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend Setup

Navigate to the backend directory `server` .

```bash
cd backend # or whatever your backend folder is named
npm install # or yarn install
```

#### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=a_strong_secret_key_for_jwt
AI_API_KEY=your_Gemini_ai_service_api_key .
```

*   `MONGO_URI`: Get this from your MongoDB Atlas cluster or local MongoDB setup.
*   `SUPABASE_URL`, `SUPABASE_ANON_KEY`: Find these in your Supabase project settings (API section).
*   `JWT_SECRET`: Generate a strong, random string.
*   `AI_API_KEY`: Replace with your actual API key for the Gemini AI service .

#### Run Backend

```bash
npm run dev # or npm start for production
```

The backend server should now be running, typically on `http://localhost:5000`.

### 3. Frontend Setup

Navigate to the frontend directory `client`.

```bash
cd ../frontend # or whatever your frontend folder is named
npm install # or yarn install
```

#### Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*   `REACT_APP_BACKEND_URL`: Should match your backend server's address.
*   `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`: Same as your backend Supabase keys.

#### Run Frontend

```bash
npm start # or npm run dev
```

The frontend application should now be running, typically on `http://localhost:3000`.

## 🚀 Usage

1.  **Register/Login**: Access the application through your browser and create a new recruiter account or log in.
2.  **Upload Resumes**: Navigate to the "Upload" section and upload candidate resumes (e.g., PDF, DOCX).
3.  **Define Job Requirements**: Input the details and requirements for the job role you are hiring for.
4.  **Analyze & Review**: The AI will process the resumes and provide detailed analysis, skill matches, and a relevance score.
5.  **Manage Candidates**: Use the dashboard to sort, filter, and manage your candidate pipeline based on the AI's insights.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request



## 📧 Contact

Khalid Mohammed - dreambigatall1@gmail.com

Project Link: https://ai-resume-analayzer-1.onrender.com/
```






![Screenshot 2025-06-17 210309](https://github.com/user-attachments/assets/2c87c310-f2ca-40f6-abcd-4403765c2842)

![Screenshot 2025-06-17 210329](https://github.com/user-attachments/assets/75741a86-7f8c-4fda-b66b-06f9a517f2f1)
![Screenshot 2025-06-17 210350](https://github.com/user-attachments/assets/7527585e-0b02-4a46-b2f8-b711a129fe8b)
![Screenshot 2025-06-17 210421](https://github.com/user-attachments/assets/2f598345-a130-4888-8ace-71872974c3d9)
![Screenshot 2025-06-17 210450](https://github.com/user-attachments/assets/8ef7850b-6e3b-45a1-a245-b8dbcd044b88)![Screenshot 2025-06-17 210503](https://github.com/user-attachments/assets/10a71c14-4251-46fa-b7e5-856e360f8214)
![Screenshot 2025-06-17 210516](https://github.com/user-attachments/assets/32c0e91f-d60b-42c9-85b3-36257cf38609)

