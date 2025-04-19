# Phishing Email Detection Quiz

This application helps users learn to identify phishing emails through an interactive quiz. It includes a backend database to track user responses for analysis.

## Features

- Interactive quiz with realistic email examples (both phishing and legitimate)
- User registration to track individual performance
- Backend database to store user responses
- Admin dashboard to view statistics and user performance
- Detailed feedback on why emails are phishing or legitimate

## Email Examples

1. **Phishing Example 1**: LEGOSS watches promotional email with suspicious discount code
2. **Legitimate Example**: Amazon order confirmation email
3. **Phishing Example 2**: LinkedIn password change notification with malicious link

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the files
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
2. Open the `index.html` file in your browser or serve the files using a local web server

### Accessing the Admin Dashboard

After starting the backend server, you can access the admin dashboard at:
```
http://localhost:3000/admin.html
```

## Database Structure

### Users Table
- id: Unique identifier for each user
- name: User's name
- created_at: When the user was created

### Responses Table
- id: Unique identifier for each response
- user_id: Foreign key to the users table
- email_id: Identifier for the email (0, 1, or 2)
- email_type: Type of email ("phishing" or "legitimate")
- user_response: User's answer ("phishing" or "legitimate")
- is_correct: Whether the user's answer was correct
- response_time: When the response was recorded

## Future Enhancements

- Add more email examples
- Implement user authentication
- Add difficulty levels
- Create more detailed analytics
- Add educational resources about phishing prevention
