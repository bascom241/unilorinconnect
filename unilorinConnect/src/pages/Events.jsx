import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Calendar as CalendarIcon, MapPin, Clock, Users, Plus, Check, X, Filter, Book, Users2, Trophy, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { authStore } from '../store/useAuthStore';
import { eventStore } from '../store/useEventStore';
import { ArrowRight } from 'lucide-react';

const Events = () => {
  const { user } = authStore();
  const {
    events,
    fetchingEvents,
    creatingEvent,
    addingUsertoEvent,
    fetchEvents,
    createEvent,
    addUserToEvent,
    fetchSingleEvent
  } = eventStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [newEvent, setNewEvent] = useState({
    Title: '',
    Description: '',
    Date: new Date(),
    Time: '12:00',
    Location: '',
    Category: '',
  });

  // Load events on mount and when filter changes
  useEffect(() => {
    fetchEvents();
  }, []);

  // Hero slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveEvent = async () => {
    if (!newEvent.Title || !newEvent.Location || !newEvent.Category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Format date as DD/MM/YYYY for the API
      const formattedDate = format(newEvent.Date, 'dd/MM/yyyy');
      
      await createEvent({
        ...newEvent,
        Date: formattedDate,
      });

      setIsDialogOpen(false);
      setNewEvent({
        Title: '',
        Description: '',
        Date: new Date(),
        Time: '12:00',
        Location: '',
        Category: '',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await addUserToEvent(eventId);
      toast.success('RSVP successful!');
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      toast.error('Failed to RSVP');
    }
  };

  // // Filter events based on selected date
  // const filteredEvents = events.filter(event => {
  //   const eventDate = new Date(event.Date);
  //   const selectedDate = new Date(date);
    
  //   return (
  //     eventDate.getFullYear() === selectedDate.getFullYear() &&
  //     eventDate.getMonth() === selectedDate.getMonth() &&
  //     eventDate.getDate() === selectedDate.getDate()
  //   );
  // });

  const categories = [
    'Academic',
    'Social',
    'Sports',
    'Cultural',
    'Workshop',
    'Other'
  ];

  const heroSlides = [
    {
      title: "Discover Campus Events",
      subtitle: "Join vibrant activities on your campus",
      cta: "Explore Now",
      bg: "from-blue-600 via-indigo-600 to-blue-800",
      icon: <Calendar className="h-8 w-8" />
    },
    {
      title: "Host Your Event",
      subtitle: "Bring students together with your ideas",
      cta: "Create Event",
      bg: "from-green-600 via-teal-600 to-cyan-700",
      icon: <Plus className="h-8 w-8" />
    },
    {
      title: "Stay Connected",
      subtitle: "Never miss a campus moment",
      cta: "View Calendar",
      bg: "from-purple-600 via-pink-600 to-purple-700",
      icon: <Zap className="h-8 w-8" />
    }
  ];

  const featuredCategories = [
    {
      title: 'Academic',
      icon: <Book className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      count: 100,
    },
    {
      title: 'Social',
      icon: <Users2 className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      count: 150,
    },
    {
      title: 'Sports',
      icon: <Trophy className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      count: 70,
    },
    {
      title: 'Cultural',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      count: 90,
    },
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
  // Filter events based on selected date and category
// Updated filter function
const filteredEvents = events.filter(event => {
  try {
    // Parse the event date (handle both ISO strings and other formats)
    // const eventDate = new Date(event.Date);
    
    // // Compare dates (ignoring time)
    // const dateMatch = 
    //   eventDate.getFullYear() === date.getFullYear() &&
    //   eventDate.getMonth() === date.getMonth() &&
    //   eventDate.getDate() === date.getDate();

    // Compare categories
    const categoryMatch = 
      !filterCategory || 
      filterCategory === 'all' || 
      event.Category === filterCategory;

    return  categoryMatch;
  } catch (e) {
    console.error('Error parsing event date:', e);
    return false;
  }
});



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
    >
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
                className="text-3xl md:text-5xl font-bold mb-4"
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
                <Button 
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full"
                  onClick={() => heroSlides[currentSlide].cta === 'Create Event' && user ? setIsDialogOpen(true) : null}
                >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Campus Events, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-gray-400 mt-2">Stay updated with what's happening around campus</p>
          </div>
          {user && (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          )}
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Calendar, label: 'Total Events', value: '500+', color: 'blue', bgColor: 'bg-blue-500/20' },
            { icon: Users, label: 'Participants', value: '10K+', color: 'purple', bgColor: 'bg-purple-500/20' },
            { icon: Zap, label: 'Categories', value: '6+', color: 'yellow', bgColor: 'bg-yellow-500/20' },
            { icon: Trophy, label: 'New Events', value: '20+', color: 'green', bgColor: 'bg-green-500/20' }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Categories */}
        <motion.div 
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-400" />
                Popular Categories
              </CardTitle>
              <CardDescription className="text-gray-400">Browse trending event categories</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                variants={containerVariants}
              >
                {featuredCategories.map((cat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cat.color} p-1 cursor-pointer`}
                      variants={cardHoverVariants}
                      onClick={() => setFilterCategory(cat.title)}
                    >
                      <div className="bg-gray-900 rounded-lg p-4 h-full">
                        <div className="text-center">
                          <div className="p-3 rounded-full bg-white/10 inline-flex mb-3">
                            {cat.icon}
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                          <p className="text-xs text-gray-400">{cat.count} events</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal flex items-center bg-gray-800 border-gray-700 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              setDate(new Date());
              setFilterCategory('');
            }}
            className="text-gray-400 hover:text-white"
          >
            Reset Filters <X className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>

        {/* Events List */}
        {fetchingEvents ? (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </motion.div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.Date);
              const isAttending = user && event.attendees?.includes(user._id);
              
              return (
                <motion.div 
                  key={event._id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-white">{event.Title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            Organized by {event.eventOwner?.fullName || 'Unknown'}
                          </CardDescription>
                        </div>
                        <Badge className={cn(
                          "px-3 py-1 text-white",
                          event.Category === "Academic" && "bg-blue-600",
                          event.Category === "Social" && "bg-purple-600",
                          event.Category === "Sports" && "bg-green-600",
                          event.Category === "Cultural" && "bg-orange-600",
                          event.Category === "Workshop" && "bg-teal-600",
                          event.Category === "Other" && "bg-gray-600"
                        )}>
                          {event.Category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-gray-300 mb-4">{event.Description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                          <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-5 w-5 mr-2 text-blue-400" />
                          <span>{event.Time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                          <span>{event.Location}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="h-5 w-5 mr-2 text-blue-400" />
                          <span>{event.attendees?.length || 0} {event.attendees?.length === 1 ? 'person' : 'people'} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    {user && (
                      <CardFooter className="bg-gray-800/30 border-t border-gray-700">
                        <Button 
                          className={cn(
                            "w-full",
                            isAttending ? "bg-green-600 hover:bg-green-700 flex items-center" : "bg-blue-600 hover:bg-blue-700 flex items-center"
                          )}
                          onClick={() => handleRSVP(event._id)}
                          disabled={addingUsertoEvent}
                        >
                          {addingUsertoEvent ? (
                            'Processing...'
                          ) : isAttending ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> 
                              You're Attending
                            </>
                          ) : (
                            <>
                              <Users className="mr-2 h-4 w-4" /> 
                              RSVP
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 border rounded-lg bg-gray-800/50"
            variants={itemVariants}
          >
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-white">No current even for this Category.</p>
            <p className="text-gray-400 mt-2">Try selecting a different category or create your own event!</p>
            {user && (
              <Button 
                variant="ghost" 
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Create Event <Plus className="h-4 w-4 ml-1" />
              </Button>
            )}
          </motion.div>
        )}

        {/* Create Event Dialog */}
        {isDialogOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-[550px] text-white"
            >
              <div>
                <div className="text-2xl font-semibold mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-blue-400" /> Create a New Event
                </div>
                <div className="mb-4 text-gray-400">
                  Enter the details of your campus event. Required fields are marked with *.
                </div>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Engineering Workshop"
                    className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    value={newEvent.Title}
                    onChange={(e) => setNewEvent({...newEvent, Title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    value={newEvent.Description}
                    onChange={(e) => setNewEvent({...newEvent, Description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date *</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white flex items-center"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-400"/>
                          {newEvent.Date ? format(newEvent.Date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <CalendarComponent
                          mode="single"
                          selected={newEvent.Date}
                          onSelect={(date) => date && setNewEvent({...newEvent, Date: date})}
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                    value={newEvent.Time}
                    onChange={(e) => setNewEvent({...newEvent, Time: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Engineering Auditorium"
                    className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    value={newEvent.Location}
                    onChange={(e) => setNewEvent({...newEvent, Location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category *</Label>
                  <Select 
                    value={newEvent.Category} 
                    onValueChange={(value) => setNewEvent({...newEvent, Category: value})}
                  >
                    <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={creatingEvent}
                  className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEvent}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={creatingEvent}
                >
                  {creatingEvent ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Events;