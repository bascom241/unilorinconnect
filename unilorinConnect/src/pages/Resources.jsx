
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, FileText, Download, BookOpen, File, FileUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Resources = () => {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    fileName: '',
    fileType: '',
    fileSize: '',
    fileContent: null,
    category: '',
    course: '',
    year: 'none'
  });
  
  // Load resources from localStorage on mount
  useEffect(() => {
    const storedResources = JSON.parse(localStorage.getItem('campusResources') || '[]');
    setResources(storedResources);
    
    // If no resources exist, create sample data
    if (storedResources.length === 0) {
      const sampleResources = [
        {
          id: 'res1',
          title: 'Complete Calculus Notes',
          description: 'Comprehensive notes covering differential and integral calculus, including examples and practice problems.',
          link: 'https://example.com/calculus-notes',
          category: 'Notes',
          course: 'MTH101',
          year: '1st Year',
          uploaderId: 'user1',
          uploaderName: 'John Doe',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          downloads: 24
        },
        {
          id: 'res2',
          title: 'Introduction to Programming with Python PDF',
          description: 'Learn the basics of programming using Python. Covers variables, loops, functions, and more.',
          link: 'https://example.com/python-intro',
          category: 'Textbook',
          course: 'CSC102',
          year: '1st Year',
          uploaderId: 'user2',
          uploaderName: 'Jane Smith',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          downloads: 42
        },
        {
          id: 'res3',
          title: 'Physics Lab Report Template',
          description: 'Standard template for writing physics lab reports, including sections for hypothesis, data, and conclusions.',
          link: 'https://example.com/physics-template',
          category: 'Template',
          course: 'PHY103',
          year: '1st Year',
          uploaderId: 'user3',
          uploaderName: 'Ahmed Mohammed',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          downloads: 18
        }
      ];
      
      setResources(sampleResources);
      localStorage.setItem('campusResources', JSON.stringify(sampleResources));
    }
  }, []);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update the file information in the state
    setUploadedFile(file);
    setNewResource({
      ...newResource,
      fileName: file.name,
      fileType: file.type,
      fileSize: formatFileSize(file.size),
      fileContent: file // We'll store the file object for download functionality
    });
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) {
      return <FileText className="h-6 w-6 text-uniblue-500" />;
    } else if (fileType?.includes('word') || fileType?.includes('document')) {
      return <File className="h-6 w-6 text-uniblue-500" />;
    } else if (fileType?.includes('sheet') || fileType?.includes('excel')) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    } else if (fileType?.includes('image')) {
      return <FileText className="h-6 w-6 text-purple-500" />;
    } else {
      return <FileText className="h-6 w-6 text-uniblue-500" />;
    }
  };
  
  const handleSaveResource = () => {
    if (!newResource.title || !newResource.fileName || !newResource.category || !newResource.course) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and upload a file',
        variant: 'destructive'
      });
      return;
    }
    
    const resourceToSave = {
      ...newResource,
      id: `res-${Date.now()}`,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      createdAt: new Date().toISOString(),
      downloads: 0
    };
    
    // Add to state and localStorage
    const updatedResources = [resourceToSave, ...resources];
    setResources(updatedResources);
    localStorage.setItem('campusResources', JSON.stringify(updatedResources));
    
    // Reset form and close dialog
    setNewResource({
      title: '',
      description: '',
      fileName: '',
      fileType: '',
      fileSize: '',
      fileContent: null,
      category: '',
      course: '',
      year: ''
    });
    
    setUploadedFile(null);
    setIsDialogOpen(false);
    
    toast({
      title: 'Resource shared',
      description: 'Your resource has been successfully shared with the community'
    });
  };
  
  const handleDownload = (resource) => {
    // In a real app, this would initiate a download and track statistics
    // For demo purposes, just increment the download count and show a toast
    
    setResources(prevResources => {
      const updatedResources = prevResources.map(res => {
        if (res.id === resource.id) {
          return {
            ...res,
            downloads: res.downloads + 1
          };
        }
        return res;
      });
      
      localStorage.setItem('campusResources', JSON.stringify(updatedResources));
      return updatedResources;
    });
    
    // Open the link in a new tab
    window.open(resource.link, '_blank');
    
    toast({
      title: 'Resource downloaded',
      description: `You're now downloading "${resource.title}"`
    });
  };
  
  // Filter resources based on search term, category, course and active tab
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? resource.category === categoryFilter : true;
    const matchesCourse = courseFilter ? resource.course === courseFilter : true;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'uploaded' && resource.uploaderId === currentUser.id);
    
    return matchesSearch && matchesCategory && matchesCourse && matchesTab;
  });
  
  // Sort resources by date (most recent first)
  const sortedResources = [...filteredResources].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Get unique categories and courses for filters
  const categories = [...new Set(resources.map(res => res.category))];
  const courses = [...new Set(resources.map(res => res.course))];
  
  // Predefined options for dropdowns
  const categoryOptions = ['Notes', 'Textbook', 'Past Paper', 'Lab Report', 'Assignment', 'Template', 'Other'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  const handleOpenModal= ()=>{
    setIsDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Resources</h1>
          <p className="text-gray-600 mt-1">Share and access study materials, lecture notes, and more</p>
        </div>
        
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600 flex item-center"
          onClick={handleOpenModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Share Resource
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="uploaded">My Uploads</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('');
            setCourseFilter('');
          }}
        >
          Clear Filters
        </Button>
      </div>
      
      {/* Resources Grid */}
      {sortedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-uniblue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-uniblue-500" />
                  </div>
                  <Badge className="bg-uniblue-50 text-uniblue-700 border-uniblue-200">
                    {resource.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {resource.course}
                  </Badge>
                  {resource.year && (
                    <Badge variant="outline" className="bg-gray-50">
                      {resource.year}
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {resource.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500">
                    Shared by {resource.uploaderName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Download className="h-4 w-4 mr-1" /> {resource.downloads} downloads
                  </span>
                  <Button 
                    variant="outline" 
                    className="text-uniblue-500 border-uniblue-200"
                    onClick={() => handleDownload(resource)}
                  >
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No resources found.</p>
          <p className="text-gray-500 mt-2">Adjust your filters or be the first to share a resource!</p>
        </div>
      )}
      
      {/* Share Resource Dialog */}
{isDialogOpen &&(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 animate-scale-in">
          <div className="mb-4">
            <div className="text-2xl font-bold">Share a Resource</div>
            <div className="text-gray-600">
              Share study materials, notes, or other academic resources with your fellow students.
            </div>
          </div>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Calculus I Notes"
                className="col-span-3"
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the resource (content, usefulness, etc.)"
                className="col-span-3"
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Upload File *
                </Label>
                <div className="col-span-3">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('file').click()}
                      className="flex items-center gap-2"
                    >
                      <FileUp className="h-4 w-4" />
                      Choose File
                    </Button>
                    {uploadedFile && (
                      <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                        {getFileIcon(uploadedFile.type)}
                        <div>
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select 
                value={newResource.category} 
                onValueChange={(value) => setNewResource({...newResource, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course Code *
              </Label>
              <Input
                id="course"
                placeholder="e.g., MTH101"
                className="col-span-3"
                value={newResource.course}
                onChange={(e) => setNewResource({...newResource, course: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Year Level
              </Label>
              <Select 
                value={newResource.year} 
                onValueChange={(value) => setNewResource({...newResource, year: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveResource}
              className="bg-uniblue-500 hover:bg-uniblue-600"
            >
              Share Resource
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Resources;
