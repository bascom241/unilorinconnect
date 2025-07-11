import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { FileText } from 'lucide-react';
import { authStore } from '../store/useAuthStore';
import { useResources } from '../store/useResources';

const Resources = () => {
  const { user } = authStore();
  const { resources, fetchResources, addResource, fetchMyResources } = useResources();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadedFile, setUploadedFile] = useState(null);

  const [newResource, setNewResource] = useState({
    Title: '',
    Description: '',
    fileName: '',
    fileType: '',
    fileSize: '',
    fileContent: null,
    category: '',
    courseCode: '',
    YearLevel: '',
  });

  useEffect(() => {
    if (activeTab === 'all') {
      fetchResources();
    } else if (activeTab === 'uploaded') {
      fetchMyResources();
    }
  }, [activeTab]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setNewResource({
      ...newResource,
      fileName: file.name,
      fileType: file.type,
      fileSize: formatFileSize(file.size),
      fileContent: file,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => <FileText className="h-6 w-6 text-blue-500" />;

  const handleSaveResource = async () => {
    const { Title, Description, category, courseCode, YearLevel, fileContent } = newResource;

    if (!Title || !Description || !category || !courseCode || !YearLevel || !fileContent) {
      toast.error('All fields are required including file upload');
      return;
    }

    const formData = new FormData();
    formData.append('Title', Title);
    formData.append('Description', Description);
    formData.append('category', category);
    formData.append('courseCode', courseCode);
    formData.append('YearLevel', YearLevel);
    formData.append('file', fileContent);

    try {
      await addResource(formData);
      toast.success('Resource uploaded successfully');
      setIsDialogOpen(false);
      setNewResource({
        Title: '',
        Description: '',
        fileName: '',
        fileType: '',
        fileSize: '',
        fileContent: null,
        category: '',
        courseCode: '',
        YearLevel: '',
      });
      setUploadedFile(null);
    } catch (err) {
      toast.error('Failed to upload resource');
    }
  };

  const handleDownload = async (resource) => {
    if (!resource.fileUrl) return toast.error('File URL is missing');

    try {
      const response = await fetch(resource.fileUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const fileExtension = resource.fileUrl.split('.').pop().split('?')[0];
      link.download = `${resource.Title || 'file'}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded "${resource.Title}"`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? resource.category === categoryFilter : true;
    const matchesCourse = courseFilter ? resource.courseCode === courseFilter : true;
    return matchesSearch && matchesCategory && matchesCourse;
  });

  const sortedResources = [...filteredResources].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const categories = [...new Set(resources.map((res) => res.category))];
  const courses = [...new Set(resources.map((res) => res.courseCode))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Academic Resources</h1>
          <p className="text-gray-600">Share and access study materials, lecture notes, and more</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 text-white">
          Upload Resource
        </Button>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
        >
          All Resources
        </Button>
        <Button
          variant={activeTab === 'uploaded' ? 'default' : 'outline'}
          onClick={() => setActiveTab('uploaded')}
        >
          My Resources
        </Button>
      </div>

      <Input
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedResources.map((resource) => (
          <Card key={resource._id} className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {getFileIcon()}
              <div className="text-lg font-semibold">{resource.Title}</div>
            </div>
            <div className="text-sm text-gray-600">{resource.Description}</div>
            <div className="text-sm mt-2">Course: {resource.courseCode}</div>
            <div className="text-sm">Category: {resource.category}</div>
            <div className="text-sm">Year Level: {resource.YearLevel}</div>
            <div className="text-sm">Uploader: {resource.resourceOwner?.fullName}</div>
            <Button onClick={() => handleDownload(resource)} className="mt-3 bg-blue-500 text-white w-full">
              Download
            </Button>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Upload New Resource</h2>

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newResource.Title}
                  onChange={(e) => setNewResource({ ...newResource, Title: e.target.value })}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newResource.Description}
                  onChange={(e) => setNewResource({ ...newResource, Description: e.target.value })}
                />
              </div>

              <div>
                <Label>Course Code</Label>
                <Input
                  value={newResource.courseCode}
                  onChange={(e) => setNewResource({ ...newResource, courseCode: e.target.value })}
                />
              </div>

              <div>
                <Label>Category</Label>
                <select
                  value={newResource.category}
                  onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Category</option>
                  <option value="lecture">Lecture Note</option>
                  <option value="assignment">Assignment</option>
                  <option value="past">Past Question</option>
                </select>
              </div>

              <div>
                <Label>Year Level</Label>
                <select
                  value={newResource.YearLevel}
                  onChange={(e) => setNewResource({ ...newResource, YearLevel: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Year</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>

              <div>
                <Label>Upload File</Label>
                <Input type="file" onChange={handleFileChange} />
                {uploadedFile && (
                  <p className="text-sm text-gray-500 mt-1">Selected file: {uploadedFile.name}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveResource}>Save Resource</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
