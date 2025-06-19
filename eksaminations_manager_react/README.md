# Exam Management System

A React TypeScript application for managing oral examinations. This system allows examiners to create exams, add students, conduct examinations with question drawing and timing, and view exam history with grades and statistics.

## Features

- **Create Exams**: Set up exams with course details, date, number of questions, and time limits
- **Add Students**: Add students to exams in examination order
- **Start Exams**: Begin examination sessions with question drawing functionality
- **Timer System**: Countdown timer with visual and audio alerts
- **Grade Recording**: Record student grades and notes
- **Exam History**: View completed exams with statistics and grade distribution
- **Responsive Design**: Modern UI built with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- Bun (recommended) or npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

## Running the Application

### 1. Start the JSON Server (Backend)
In one terminal, start the JSON server:
```bash
bun run server
```
This will start the server on `http://localhost:3001`

### 2. Start the React Application
In another terminal, start the React development server:
```bash
bun run dev
```
This will start the app on `http://localhost:3000`

## Usage

### 1. Create an Exam
- Navigate to "Create Exam"
- Fill in exam details:
  - Exam term (e.g., "Summer 25")
  - Course name
  - Date
  - Number of questions
  - Examination time (in minutes)
  - Start time

### 2. Add Students
- Go to "Add Students"
- Select the created exam
- Add students with their ID and name in examination order

### 3. Start Examination
- Navigate to "Start Exam"
- Select the exam with students
- Click "Start Exam" to begin

### 4. Examination Process
For each student:
1. **Draw Question**: Click to get a random question number
2. **Start Examination**: Begin the countdown timer
3. **Enter Notes**: Add notes about student performance
4. **End Examination**: Stop the timer
5. **Assign Grade**: Select a grade (A-F)
6. **Save & Continue**: Move to next student or complete exam

### 5. View History
- Go to "View History"
- Select a completed exam
- View student results, grades, and class statistics

## Data Structure

The application uses a JSON server with the following data structure:

```json
{
  "exams": [
    {
      "id": 1,
      "examTerm": "Summer 25",
      "courseName": "Web Development",
      "date": "2025-01-20",
      "numberOfQuestions": 10,
      "examinationTime": 15,
      "startTime": "09:00",
      "status": "created|in-progress|completed"
    }
  ],
  "students": [
    {
      "id": 1,
      "examId": 1,
      "studentId": "S001",
      "name": "John Doe",
      "order": 1
    }
  ],
  "examSessions": [
    {
      "id": 1,
      "examId": 1,
      "studentId": 1,
      "questionNumber": 3,
      "actualExaminationTime": 12,
      "notes": "Good understanding of React concepts",
      "grade": "A",
      "completed": true
    }
  ]
}
```

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: JSON Server
- **Package Manager**: Bun
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/          # React components
│   ├── Home.tsx        # Main dashboard
│   ├── CreateExam.tsx  # Exam creation form
│   ├── AddStudents.tsx # Student management
│   ├── StartExam.tsx   # Examination interface
│   └── ViewHistory.tsx # Exam history and statistics
├── services/           # API services
│   └── api.ts         # HTTP client for JSON server
├── types/             # TypeScript interfaces
│   └── index.ts       # Data type definitions
├── App.tsx            # Main app component with routing
└── index.css          # Global styles with Tailwind
```

## API Endpoints

The JSON server provides the following REST endpoints:

- `GET /exams` - Get all exams
- `POST /exams` - Create a new exam
- `PATCH /exams/:id` - Update an exam
- `GET /students?examId=:id` - Get students for an exam
- `POST /students` - Add a new student
- `GET /examSessions?examId=:id` - Get exam sessions for an exam
- `POST /examSessions` - Create a new exam session
- `PATCH /examSessions/:id` - Update an exam session

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run server` - Start JSON server
- `bun run build` - Build for production
- `bun run test` - Run tests

### Adding New Features

1. Create new components in `src/components/`
2. Add TypeScript interfaces in `src/types/index.ts`
3. Add API methods in `src/services/api.ts`
4. Update routing in `src/App.tsx`

## License

This project is created for educational purposes as part of a front-end development examination.
