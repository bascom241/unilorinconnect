import { useState, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Plus, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { authStore } from '../store/useAuthStore';
import { useLostAndFound } from '../store/useLostAndFound';

const LostFound = () => {
  const { user } = authStore();
  const currentUser = user?.user || {};
  const { lostAndFoundItems, fetchLostAndFoundItems, createLostAndFoundItem, creatingLostAndFoundItem, loadingLostAndFoundItems, getMyLostAndFoundItems } = useLostAndFound();
  const { addNotification } = useNotifications();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    location: '',
    contactInfo: currentUser?.email || '', // Use email
    image: null
  });

  useEffect(() => {
    if (activeTab === 'mine') {
      getMyLostAndFoundItems();
    } else {
      fetchLostAndFoundItems();
    }
  }, [activeTab, fetchLostAndFoundItems, getMyLostAndFoundItems]);


  const handleSubmit = async () => {
    const { title, description, location, contactInfo, image } = newItem;

    if (!title || !description || !location || !contactInfo || !image) {
      toast({ title: 'Missing Fields', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('contactInfo', contactInfo);
    formData.append('image', image);

    try {
      await createLostAndFoundItem(formData);
      toast({ title: 'Item Reported', description: 'Your lost/found item has been submitted.' });
      addNotification({
        title: 'Item Reported',
        message: `"${title}" was successfully added to the Lost & Found list.`,
        type: 'info'
      });
      setIsDialogOpen(false);
      setNewItem({
        title: '',
        description: '',
        location: '',
        contactInfo: currentUser?.email || '',
        image: null
      });

    } catch (error) {
      toast({ title: 'Error', description: 'Could not report item', variant: 'destructive' });
    }
  };

  const filteredItems = lostAndFoundItems?.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'all' ||
      (activeTab === 'mine' && item.posterInformation?._id === currentUser._id);

    return matchesSearch && matchesTab;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600 mt-1">Report lost items or help return found items to their owners</p>
        </div>

        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600 flex items-center text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Report Item
        </Button>
      </div>

      <Input
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin size={14} />
                {item.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={14} />
                {format(new Date(item.createdAt), 'PPP')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MessageSquare size={14} />
                {item.contactInfo}
              </div>
              {item.posterInformation && (
                <div className="flex items-center mt-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={item.posterInformation.image} />
                    <AvatarFallback>{getInitials(item.posterInformation.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm text-gray-700">{item.posterInformation.fullName}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Report Lost/Found Item</h2>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-red-600 text-lg font-bold">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
              </div>
              <div>
                <Label>Contact Info</Label>
                <Input
                  value={newItem.contactInfo}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  onChange={(e) => setNewItem({ ...newItem, contactInfo: e.target.value })}
                />
              </div>
              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {creatingLostAndFoundItem ? "Creating..." : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LostFound;
