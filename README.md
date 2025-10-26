# Shilpkari - E-commerce Platform for Artisans

A comprehensive e-commerce platform designed specifically for Indian artisans to showcase and sell their handcrafted products globally. Built with modern web technologies and enhanced with AI, VR/AR, and blockchain features.

## 🎯 Project Overview

Shilpkari (शिल्पकारी) is a digital marketplace that connects skilled Indian artisans with global buyers through an innovative platform featuring:

- **AI-Powered Features**: Demand forecasting and automated quality checks
- **VR/AR Integration**: Immersive product viewing experiences
- **Blockchain Technology**: Transparent supply chain tracking
- **Multilingual Support**: Available in 8 Indian languages
- **Sentiment Analysis**: Customer feedback analysis with actionable recommendations

## 🚀 Features

### Core Features
- User registration and authentication (Artisans & Buyers)
- Product listing and management
- Shopping cart and checkout
- Order management and tracking
- Payment integration
- User profiles and dashboards

### Advanced Features
- **AI Demand Forecasting**: Predict product demand using machine learning
- **Automated Quality Checks**: AI-powered image quality assessment
- **VR/AR Product Viewing**: 360° and AR product visualization
- **Blockchain Supply Chain**: Transparent tracking from artisan to customer
- **Multilingual Support**: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi
- **Sentiment Analysis**: Customer feedback analysis with recommendations
- **Analytics Dashboard**: Comprehensive insights for artisans and buyers

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **i18next** - Internationalization
- **Three.js** - 3D graphics for VR/AR
- **AR.js** - Augmented Reality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage and processing

### AI & ML
- **TensorFlow.js** - Machine learning
- **Natural Language Processing** - Sentiment analysis
- **Computer Vision** - Image quality assessment

### Blockchain
- **Web3.js** - Ethereum integration
- **Smart Contracts** - Supply chain tracking

## 📁 Project Structure

```
shilpkari-artisan-marketplace/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── locales/        # Translation files
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v7 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shilpkari-artisan-marketplace.git
   cd shilpkari-artisan-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shilpkari

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Blockchain
ETHEREUM_RPC_URL=http://localhost:7545
SUPPLY_CHAIN_CONTRACT_ADDRESS=your_contract_address

# AI Services
OPENAI_API_KEY=your_openai_key
TENSORFLOW_MODEL_URL=your_model_url
```

## 📱 Features in Detail

### 1. User Management
- **Registration**: Separate flows for artisans and buyers
- **Authentication**: JWT-based secure authentication
- **Profiles**: Comprehensive user profiles with preferences
- **Roles**: Artisan, Buyer, and Admin roles

### 2. Product Management
- **Listing**: Rich product listings with multiple images
- **Categories**: Organized by craft types (pottery, textiles, jewelry, etc.)
- **Search & Filter**: Advanced search and filtering options
- **Quality Check**: AI-powered image quality assessment

### 3. AI Features
- **Demand Forecasting**: Predict product demand using historical data
- **Quality Assessment**: Automated image quality scoring
- **Sentiment Analysis**: Analyze customer reviews and feedback
- **Recommendations**: AI-powered product and artisan recommendations

### 4. VR/AR Integration
- **360° Product View**: Immersive product visualization
- **AR Try-On**: Augmented reality product placement
- **VR Showroom**: Virtual reality shopping experience

### 5. Blockchain Integration
- **Supply Chain Tracking**: Transparent product journey tracking
- **Authenticity Verification**: Blockchain-based product verification
- **Smart Contracts**: Automated supply chain events

### 6. Multilingual Support
- **8 Languages**: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi
- **RTL Support**: Right-to-left language support
- **Localized Content**: Region-specific content and marketing

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean, intuitive interface
- **Accessibility**: WCAG 2.1 compliant
- **Animations**: Smooth micro-interactions
- **Dark Mode**: Optional dark theme
- **Progressive Web App**: PWA capabilities

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Cross-origin resource sharing protection
- **Rate Limiting**: API rate limiting
- **HTTPS**: Secure data transmission

## 📊 Analytics & Reporting

- **User Analytics**: User behavior and engagement metrics
- **Sales Analytics**: Revenue and sales performance tracking
- **Product Analytics**: Product performance and popularity metrics
- **AI Insights**: AI-powered business insights and recommendations

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
cd ..
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t shilpkari-app .

# Run container
docker run -p 3000:3000 -p 5000:5000 shilpkari-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ankit Kumar Rai** - Frontend/AR-VR/AI Development
- **Bhavya Pradhan** - Backend/Blockchain/Localization

## 📞 Support

For support, email support@shilpkari.com or join our Slack channel.

## 🙏 Acknowledgments

- Indian artisans and craftspeople
- Open source community
- Technology partners and contributors

---

**Made with ❤️ in India for Indian Artisans**
