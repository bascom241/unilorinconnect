import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingCart, Calendar, MessageSquare, FileText, MapPin, Bell, BookOpen, Users, Star, TrendingUp, Award, Zap, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authStore } from '../store/useAuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { marketStore } from '../store/useMarketStore';
import { eventStore } from '../store/useEventStore';
const Dashboard = () => {

  const navigate = useNavigate();
  const { user } = authStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestItems, setLatestItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const { fetchTopThreeItems, topThreeList } = marketStore();
  const { fetchTopThreeEvents, topThreeEvents } = eventStore();


  useEffect(()=> {
    fetchTopThreeEvents()
  },[])
  useEffect(() => {
    fetchTopThreeItems()
  }, [])

  const handelNavigation = (destination) => {
    navigate(`/${destination}`)
  }
  useEffect(() => {
    const mockItems = [
      {
        id: '1',
        title: 'Advanced Calculus Textbook',
        price: '₦3,500',
        originalPrice: '₦5,000',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        category: 'Books',
        seller: 'Sarah M.',
        rating: 4.8,
        isHot: true
      },
      {
        id: '2',
        title: 'Premium Study Desk',
        price: '₦15,000',
        originalPrice: '₦20,000',
        image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        category: 'Furniture',
        seller: 'Mike T.',
        rating: 4.9,
        isNew: true
      },
      {
        id: '3',
        title: 'TI-84 Scientific Calculator',
        price: '₦5,000',
        originalPrice: '₦7,500',
        image: 'https://images.unsplash.com/photo-1564473185935-b0ae17d3e571?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        category: 'Electronics',
        seller: 'Emma K.',
        rating: 5.0,
        isHot: true
      },
    ];

    setLatestItems(mockItems);

    const today = new Date();
    const mockEvents = [
      {
        id: '1',
        title: 'Tech Innovation Summit',
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        location: 'Engineering Auditorium',
        attendees: 320,
        category: 'Technology',
        featured: true,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '2',
        title: 'Entrepreneurship Workshop',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        location: 'Business School',
        attendees: 150,
        category: 'Business',
        featured: false,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '3',
        title: 'Campus Clean-up Drive',
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        location: 'Student Union Building',
        attendees: 85,
        category: 'Community',
        featured: false,
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
    ];

    setUpcomingEvents(mockEvents);

    setAchievements([
      { title: 'Top Seller', description: 'Sold 15+ items this month', icon: <Award className="h-5 w-5" />, color: 'bg-yellow-500' },
      { title: 'Community Helper', description: 'Helped 20+ students', icon: <Heart className="h-5 w-5" />, color: 'bg-pink-500' },
      { title: 'Event Organizer', description: 'Organized 3 events', icon: <Calendar className="h-5 w-5" />, color: 'bg-purple-500' }
    ]);
  }, []);

  const heroSlides = [
    {
      title: "Connect. Trade. Thrive.",
      subtitle: "Join 10,000+ students building the future together",
      cta: "Start Exploring",
      bg: "from-blue-600 via-purple-600 to-blue-800",
      icon: <Globe className="h-8 w-8" />,
      destination: "dashboard"

    },
    {
      title: "Your Campus Marketplace",
      subtitle: "Buy, sell, and discover amazing deals from fellow students",
      cta: "Browse Items",
      bg: "from-green-600 via-teal-600 to-cyan-700",
      icon: <ShoppingCart className="h-8 w-8" />,
      destination: "marketplace"
    },
    {
      title: "Never Miss an Event",
      subtitle: "Stay updated with the latest campus activities and networking opportunities",
      cta: "View Events",
      bg: "from-orange-600 via-red-600 to-pink-700",
      icon: <Calendar className="h-8 w-8" />,
      destination: "events"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  const handleDestination2 = (destination) => {
    navigate(`/${destination}`)
  }

  const featuredItems = [
    {
      title: 'Marketplace',
      description: 'Buy & sell with confidence',
      subtitle: '2,500+ active listings',
      icon: <ShoppingCart className="h-6 w-6" />,
      path: '/marketplace',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      destination: "marketplace"

    },
    {
      title: 'Events',
      description: 'Discover amazing experiences',
      subtitle: '50+ events monthly',
      icon: <Calendar className="h-6 w-6" />,
      path: '/events',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      destination: "events"
    },
    {
      title: 'Community',
      description: 'Connect with like minds',
      subtitle: '10,000+ active members',
      icon: <MessageSquare className="h-6 w-6" />,
      path: '/chat',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
      destination: "chat"
    },
    {
      title: 'Resources',
      description: 'Access premium content',
      subtitle: '1,000+ study materials',
      icon: <FileText className="h-6 w-6" />,
      path: '/resources',
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'from-amber-600 to-amber-700',
      destination: "resources"
    },
    {
      title: 'Lost & Found',
      description: 'Reunite with belongings',
      subtitle: '95% recovery rate',
      icon: <MapPin className="h-6 w-6" />,
      path: '/lost-found',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
      destination: "lost-found"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <div className="min-h-screen text-foreground bg-background">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`bg-gradient-to-r ${heroSlides[currentSlide].bg} p-8 md:p-12 relative`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-4"
              >
                {heroSlides[currentSlide].icon}
              </motion.div>
              <motion.h1
                className="text-3xl md:text-5xl font-bold mb-4 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-white/90 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full" onClick={() => handelNavigation(heroSlides[currentSlide].destination)} >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="px-4 md:px-6">
        {/* Welcome Header */}
        <motion.div
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'Student'}</span>!
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="inline-block ml-2"
              >
                👋
              </motion.span>
            </h2>
            <p className="text-muted-foreground mt-2">Ready to make today amazing?</p>
          </div>
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary relative">
              <Bell className="h-5 w-5" />
              <motion.span
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Users, label: 'Connections', value: '1,247', change: '+12%', color: 'blue', bgColor: 'bg-blue-500/20' },
            { icon: ShoppingCart, label: 'Sales', value: '₦127K', change: '+18%', color: 'green', bgColor: 'bg-green-500/20' },
            { icon: Calendar, label: 'Events', value: '23', change: '+5%', color: 'purple', bgColor: 'bg-purple-500/20' },
            { icon: BookOpen, label: 'Resources', value: '156', change: '+8%', color: 'amber', bgColor: 'bg-amber-500/20' }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card border-border hover:bg-accent transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Banner */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    Your Achievements
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center px-3 py-2 rounded-full ${achievement.color}/20 text-sm`}
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {achievement.icon}
                        <span className="ml-2 font-medium">{achievement.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="hidden md:flex" >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" onClick={() => navigate("/profile")} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              onClick={() => handleDestination2(item.destination)}
            >
              <motion.div
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.color} p-1 cursor-pointer`}
                variants={cardHoverVariants}
              >
                <div className="bg-card rounded-lg p-4 h-full">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-secondary inline-flex mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Marketplace Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                      Hot Marketplace Deals
                    </CardTitle>
                    <CardDescription>Trending items you'll love</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/marketplace")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topThreeList.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="relative flex items-center p-4 rounded-xl bg-secondary hover:bg-secondary/80 cursor-pointer transition-all border border-border"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {(item.Title || item.Description) && (
                        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${item.isHot ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                          }`}>
                          {item.isHot ? '🔥 HOT' : '✨ NEW'}
                        </div>
                      )}
                      <img
                        src={item.itemImage}
                        alt={item.Title}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.Title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">by {item?.posterInformation?.fullName}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-primary text-sm font-bold">{item.price}</span>
                            <span className="text-xs text-muted-foreground line-through">{item.price - 1000}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground ml-1">5</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => navigate("/marketplace")}>
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Events Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Featured Events
                    </CardTitle>
                    <CardDescription>Don't miss out!</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/events")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topThreeEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all border ${event.featured
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-primary/30'
                        : 'bg-secondary border-border hover:bg-secondary/80'
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {event?.Title && (
                        <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-xs font-bold text-white">
                          ⭐ FEATURED
                        </div>
                      )}
                  
                        <div className="flex items-center gap-4 p-4 rounded-lg shadow-sm bg-white border">
                          {/* Image or Placeholder */}
                          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7l6 6-6 6M21 7l-6 6 6 6"
                              />
                            </svg>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{event.Title || "Untitled"}</h3>
                            <p className="text-xs text-gray-500">{event.Description || "No description available."}</p>
                          </div>

                          {/* Price or action */}
                          <div>
                            <span className="text-sm font-medium text-green-600">
                              ${event.price || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{event.Title}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs px-2 py-1 bg-purple-900/30 text-primary rounded-full">
                              {event.Date}
                            </span>
                            <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">
                              {event.Category}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <p className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" /> {event.Location}
                            </p>
                            {/* <p className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {event.attendees} going
                            </p> */}
                          </div>
                        </div>
                      
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => navigate("/events")}>
                  Join Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;