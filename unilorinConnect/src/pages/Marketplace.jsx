import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Star, ShoppingCart, ArrowRight, Filter, BookOpen, Zap, Monitor, Shirt, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from "react-hot-toast";
import { authStore } from '../store/useAuthStore';
import { marketStore } from '../store/useMarketStore';

const categories = ['Books & Study Materials', 'Electronics', 'Furniture', 'Clothing', 'Services', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Used'];
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = authStore();
  const { createItem, fetchItems, itemList, creatingItem } = marketStore();

  const activeList = itemList.length.toString()
  const activeCategories = categories.length
  const [newItem, setNewItem] = useState({
    Title: '',
    Description: '',
    price: '',
    category: '',
    condition: '',
    itemImage: null,
    posterInformation: user?._id
  });

  useEffect(() => {
    fetchItems({ search: searchTerm, category });
  }, [searchTerm, category]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();
  const handleContactSeller = (item) => {
    if(item.posterInformation?._id === user?._id) {
      toast.error("You cannot contact yourself about this item.");
      return;
    }
    // toast.success(`Contact initiated with ${item?.posterInformation?.fullName} about "${item?.Title}"`);
    navigate(`/chat`, {
      state: {
        itemId: item._id,
        itemTitle: item.Title,
        sellerId: item.posterInformation?._id,
        sellerName: item.posterInformation?.fullName
      }
    });
  };

  const filteredItems = itemList?.filter(item => {
    const matchesSearch = item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' ? true : item.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitItem = async () => {
    const requiredFields = ['Title', 'price', 'category', 'itemImage'];
    const missingFields = requiredFields.filter(field => !newItem[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const formData = new FormData();
    Object.keys(newItem).forEach(key => {
      formData.append(key, newItem[key]);
    });

    try {
      const success = await createItem(formData);
      if (success) {
        toast.success("Item listed successfully!");
        setNewItem({
          Title: '',
          Description: '',
          price: '',
          category: '',
          condition: '',
          itemImage: null,
          posterInformation: user?._id,
        });
        setIsDialogOpen(false);
        fetchItems({ search: searchTerm, category });
      }
    } catch (err) {
      toast.error("An error occurred while listing the item.");
    }
  };

  const heroSlides = [
    {
      title: "Discover Great Deals",
      subtitle: "Find everything you need from fellow students",
      cta: "Start Shopping",
      bg: "from-blue-600 via-indigo-600 to-blue-800",
      icon: <ShoppingCart className="h-8 w-8" />
    },
    {
      title: "Sell Your Items",
      subtitle: "Turn your unused items into cash",
      cta: "List an Item",
      bg: "from-green-600 via-teal-600 to-cyan-700",
      icon: <Plus className="h-8 w-8" />
    },
    {
      title: "Join the Marketplace",
      subtitle: "Connect with 5,000+ active traders",
      cta: "Explore Now",
      bg: "from-purple-600 via-pink-600 to-purple-700",
      icon: <Zap className="h-8 w-8" />
    }
  ];

  const featuredCategories = [
    {
      title: 'Books & Study Materials',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      count: 1200,
    },
    {
      title: 'Electronics',
      icon: <Monitor className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      count: 850,
    },
    {
      title: 'Clothing',
      icon: <Shirt className="h-6 w-6" />,
      color: 'from-pink-500 to-pink-600',
      count: 600,
    },
    {
      title: 'Furniture',
      icon: <Armchair className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600',
      count: 400,
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
                  onClick={() => heroSlides[currentSlide].cta === 'List an Item' ? setIsDialogOpen(true) : null}
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
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8 flex justify-between items-start sm:flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className='sm:flex flex-col'>
            <h2 className="text-2xl  md:text-3xl font-bold">
              Campus Marketplace, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'Student'}</span>!
            </h2>
            <p className="text-gray-400 mt-2">Discover and trade with your campus community</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r  from-blue-600 to-indigo-600 sm:text-xl text-sm text-white"
          >
            <Plus className="h-5 w-5 mr-2" /> List an Item
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: ShoppingCart, label: 'Active Listings', value: `${activeList}+`, color: 'blue', bgColor: 'bg-blue-500/20' },
            { icon: Star, label: 'Successful Trades', value: 0, color: 'yellow', bgColor: 'bg-yellow-500/20' },
            { icon: Zap, label: 'Categories', value: `${activeCategories}+`, color: 'purple', bgColor: 'bg-purple-500/20' },
            { icon: BookOpen, label: 'New Items Today', value: 0, color: 'green', bgColor: 'bg-green-500/20' }
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
          // className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
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
              <CardDescription>Browse trending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 w-full"
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
                      onClick={() => setCategory(cat.title)}
                    >
                      <div className="bg-gray-900 rounded-lg p-4 h-full">
                        <div className="text-center">
                          <div className="p-3 rounded-full bg-white/10 inline-flex mb-3">
                            {cat.icon}
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                          <p className="text-xs text-gray-400">{cat.count} listings</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || category) && (
            <Button
              variant="ghost"
              onClick={() => { setSearchTerm(''); setCategory(''); }}
              className="text-gray-400 hover:text-white"
            >
              Clear Filters <X className="h-4 w-4 ml-1" />
            </Button>
          )}
        </motion.div>

        {/* Items Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all relative h-full">
                  {item.condition === 'New' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 mr-1 inline" /> New
                    </div>
                  )}
                  <CardContent className="p-4">
                    <img
                      src={item.itemImage}
                      alt={item.Title}
                      className="h-40 w-full object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-sm truncate">{item.Title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{item.Description.slice(0, 80)}...</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-blue-400 text-sm font-bold">₦{item.price}</span>
                      <span className="text-xs text-gray-400">{item.category}</span>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContactSeller(item)}
                    >
                      Contact Seller
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              variants={itemVariants}
            >
              <Search className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-medium text-white mt-2">No items found</h3>
              <p className="text-gray-400">{searchTerm || category ? 'Try adjusting your search or filters' : 'Be the first to list an item!'}</p>
              <Button
                variant="ghost"
                onClick={() => { setSearchTerm(''); setCategory(''); }}
                className="mt-4 text-gray-400 hover:text-white"
              >
                Clear all filters <X className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Item Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-[550px] text-white"
          >
            <div>
              <div className="text-2xl font-semibold mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-400" /> List a New Item
              </div>
              <div className="mb-4 text-gray-400">
                Fill in the details of the item you want to sell or trade. Required fields are marked with *.
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Textbook for Calculus"
                  className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={newItem.Title}
                  onChange={(e) => setNewItem({ ...newItem, Title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item..."
                  className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={newItem.Description}
                  onChange={(e) => setNewItem({ ...newItem, Description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 5000"
                  className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category *</Label>
                <Select value={newItem.category} onValueChange={(val) => setNewItem({ ...newItem, category: val })}>
                  <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">Condition</Label>
                <Select value={newItem.condition} onValueChange={(val) => setNewItem({ ...newItem, condition: val })}>
                  <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {conditions.map(cond => (
                      <SelectItem key={cond} value={cond} className="hover:bg-gray-700">{cond}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  onChange={(e) => setNewItem({ ...newItem, itemImage: e.target.files[0] })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={creatingItem}
                className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitItem}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={creatingItem}
              >
                {creatingItem ? 'Listing...' : 'Submit Listing'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Marketplace;