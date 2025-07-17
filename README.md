# HomLet - Real Estate Agent-Client Connection Platform

HomLet is a comprehensive real estate platform that connects property seekers with verified agents. The platform features a secure payment system, property management tools, and commission tracking.

## Features

### For Clients
- Browse properties with detailed photos and videos
- Filter properties by location, price, and type
- Pay ₦2,000 to unlock agent contact information
- Rate and review agents
- Track payment history
- Responsive design for all devices

### For Agents
- Upload unlimited properties with 5 photos and 1 video each
- Set custom commission rates
- Track property performance and views
- Manage deals and commissions
- Build reputation through client ratings
- Professional dashboard with analytics

### For Admins
- Monitor platform statistics
- Manage users (clients and agents)
- Oversee all properties and deals
- Block/unblock agents for unpaid commissions
- Track payment transactions
- Generate reports and analytics

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Templating**: EJS
- **Payment**: Paystack integration
- **File Upload**: Multer
- **Authentication**: Express Session

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd homlet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PORT=3000
NODE_ENV=development
ADMIN_EMAIL=admin@homlet.com
ADMIN_PASSWORD=admin123
```

5. Create uploads directory structure:
```bash
mkdir -p uploads/profiles uploads/properties uploads/videos
```

6. Start the development server:
```bash
npm run dev
```

## Usage

### Getting Started

1. **Access the Application**: Open your browser and navigate to `http://localhost:3000`

2. **Admin Access**: Use the credentials from your `.env` file to access the admin panel

3. **User Registration**: 
   - Clients can register to browse and unlock agent contacts
   - Agents can register to list properties and earn commissions

### Client Workflow

1. **Registration**: Create an account with basic information
2. **Browse Properties**: Filter and search through available properties
3. **View Details**: See property photos, videos, and details
4. **Unlock Agent**: Pay ₦2,000 to access agent contact information
5. **Contact Agent**: Call or message the agent directly
6. **Rate Agent**: Provide feedback after interaction

### Agent Workflow

1. **Registration**: Sign up with commission rate and profile details
2. **Upload Properties**: Add listings with exactly 5 photos and 1 video
3. **Manage Listings**: Edit, update, or delete properties
4. **Track Performance**: Monitor views, inquiries, and ratings
5. **Handle Commissions**: Pay commissions on closed deals

### Admin Functions

1. **Dashboard**: Overview of platform statistics
2. **User Management**: View and manage all users
3. **Property Oversight**: Monitor all property listings
4. **Deal Management**: Track and close deals
5. **Commission Tracking**: Ensure agents pay required commissions

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/client-register` - Client registration form
- `POST /auth/client-register` - Handle client registration
- `GET /auth/agent-register` - Agent registration form
- `POST /auth/agent-register` - Handle agent registration

### Properties
- `GET /houses` - Browse all properties
- `GET /property/:id` - View property details
- `POST /agent/upload` - Upload new property
- `PUT /agent/edit/:id` - Edit property
- `DELETE /agent/delete/:id` - Delete property

### Payments
- `POST /payment/initialize` - Initialize payment
- `GET /payment/callback` - Handle payment callback
- `GET /payment/verify/:reference` - Verify payment

### Dashboards
- `GET /client/dashboard` - Client dashboard
- `GET /agent/dashboard` - Agent dashboard
- `GET /admin/dashboard` - Admin dashboard

## Database Schema

### Users Collection
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  password: String,
  role: String, // 'client', 'agent', 'admin'
  commission: Number, // Agent only
  profilePicture: String, // Agent only
  bio: String, // Agent only
  rating: Number, // Agent only
  totalRatings: Number, // Agent only
  isBlocked: Boolean, // Agent only
  unlockedAgents: [ObjectId], // Client only
  paymentHistory: [Object] // Client only
}
```

### Properties Collection
```javascript
{
  title: String,
  description: String,
  price: Number,
  location: {
    state: String,
    area: String
  },
  propertyType: String, // 'rent' or 'buy'
  images: [String], // Array of 5 image filenames
  video: String, // Video filename
  agent: ObjectId, // Reference to User
  status: String, // 'active', 'sold', 'rented'
  views: Number,
  interested: [Object]
}
```

### Deals Collection
```javascript
{
  property: ObjectId,
  client: ObjectId,
  agent: ObjectId,
  status: String, // 'pending', 'closed', 'flagged'
  dealValue: Number,
  commission: Number,
  commissionPaid: Boolean,
  notes: String
}
```

### Ratings Collection
```javascript
{
  client: ObjectId,
  agent: ObjectId,
  property: ObjectId,
  rating: Number, // 1-5
  comment: String
}
```

## File Structure

```
homlet/
├── models/
│   ├── User.js
│   ├── Property.js
│   ├── Deal.js
│   └── Rating.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── client.js
│   ├── agent.js
│   ├── admin.js
│   ├── property.js
│   └── payment.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   ├── auth/
│   ├── client/
│   ├── agent/
│   ├── admin/
│   └── property/
├── public/
│   ├── css/
│   └── js/
├── uploads/
│   ├── profiles/
│   ├── properties/
│   └── videos/
├── server.js
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- File upload restrictions
- Role-based access control
- CSRF protection
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@homlet.com
- Phone: +234 800 123 4567

## Deployment

The application is ready for deployment to platforms like:
- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

Remember to:
1. Set up environment variables on your hosting platform
2. Configure MongoDB Atlas for production
3. Set up Paystack production keys
4. Configure file upload storage for production
5. Set up proper logging and monitoring

## Version History

- v1.0.0 - Initial release with core functionality
- Features: User authentication, property management, payment integration, admin panel