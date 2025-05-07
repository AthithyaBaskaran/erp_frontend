import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Snackbar,
  Pagination,
  Stack
} from '@mui/material';
import '../../styles/orderItems.css';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import FolderIcon from '@mui/icons-material/Folder';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import RefreshIcon from '@mui/icons-material/Refresh';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import { showInventory, fetchCategoriesApi } from '../Api/apiUrl';

// Define types for our data
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  stockQuantity?: number;
  imageUrl?: string;
}

interface Category {
  id: number;
  categoryName: string;
}

const OrderItems: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // High-quality 4K product images for fast loading with relevant categories (Flipkart style)
  const productImageMap = {
    // Electronics
    laptop: 'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/q/e/z/-original-imagpxgqesgrthks.jpeg?q=70',
    mobile: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/3/5/l/-original-imaghx9qmgqsk9s4.jpeg?q=70',
    monitor: 'https://rukminim2.flixcart.com/image/832/832/l5ld8y80/monitor/l/k/s/-original-imagg897ufhyvwqq.jpeg?q=70',
    headphone: 'https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/r/v/o/-original-imagkrkygefhfnz9.jpeg?q=70',
    watch: 'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/m/l/c/-original-imagrxe8vgkfsd7z.jpeg?q=70',
    printer: 'https://rukminim2.flixcart.com/image/832/832/xif0q/printer/m/m/k/-original-imagqvesqgxgzgdh.jpeg?q=70',
    camera: 'https://rukminim2.flixcart.com/image/832/832/kw9krrk0/dslr-camera/q/l/w/-original-imag8z5wwaqtq9bz.jpeg?q=70',
    speaker: 'https://rukminim2.flixcart.com/image/832/832/xif0q/speaker/mobile-tablet-speaker/o/t/c/-original-imaghgcm9mzfsdzd.jpeg?q=70',
    keyboard: 'https://rukminim2.flixcart.com/image/832/832/xif0q/keyboard/desktop-keyboard/o/t/y/-original-imagz3cugy7jbwfm.jpeg?q=70',
    mouse: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mouse/l/f/e/-original-imaghgeczdh3gqyv.jpeg?q=70',
    
    // Cleaning Products
    cloth: 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70',
    microfiber: 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70',
    cleaning: 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70',
    mop: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mop-set/z/m/o/spin-mop-with-wheel-and-2-microfiber-refill-with-soap-dispenser-original-imaghzfbzgvazghy.jpeg?q=70',
    duster: 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70',
    
    // Accessories
    cable: 'https://rukminim2.flixcart.com/image/832/832/xif0q/data-cable/micro-usb-cable/m/k/n/-original-imaggcf6yh2kn5be.jpeg?q=70',
    charger: 'https://rukminim2.flixcart.com/image/832/832/xif0q/battery-charger/k/o/s/-original-imagg5hzwazgtczk.jpeg?q=70',
    drive: 'https://rukminim2.flixcart.com/image/832/832/xif0q/pendrive/pendrive/r/o/s/-original-imaggvxwzmuezgwz.jpeg?q=70',
    usb: 'https://rukminim2.flixcart.com/image/832/832/xif0q/pendrive/pendrive/r/o/s/-original-imaggvxwzmuezgwz.jpeg?q=70',
    
    // Stationery
    pen: 'https://rukminim2.flixcart.com/image/832/832/xif0q/pen/h/0/y/-original-imaghfn8zcgfzhqt.jpeg?q=70',
    pencil: 'https://rukminim2.flixcart.com/image/832/832/xif0q/pencil/z/p/o/-original-imaghxnhfgdynjce.jpeg?q=70',
    notebook: 'https://rukminim2.flixcart.com/image/832/832/xif0q/diary-notebook/m/l/j/-original-imaghxnhbmcvcgfh.jpeg?q=70',
    
    // Specific product types
    'microfiber cloth': 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70',
    'cleaning cloth': 'https://rukminim2.flixcart.com/image/832/832/xif0q/cleaning-cloth/c/m/m/40-microfiber-cleaning-cloth-40-40-cm-multi-purpose-super-original-imaggkhf8bvyzrsh.jpeg?q=70'
  };
  
  // Fallback product images array for backward compatibility
  const productImages = Object.values(productImageMap);
  
  // Helper function to find the best image match for a product name
  const findBestImageMatch = (productName: string): string => {
    const productNameLower = productName.toLowerCase();
    
    // Special cases for specific product types - check these first
    // Cleaning products
    if ((productNameLower.includes('microfiber') && productNameLower.includes('cloth')) || 
        (productNameLower.includes('cleaning') && productNameLower.includes('cloth'))) {
      console.log(`Product "${productName}" matched with microfiber cleaning cloth image`);
      return productImageMap['microfiber'];
    }
    
    // Check for compound terms (multiple words that should be matched together)
    const compoundTerms = [
      ['cleaning', 'cloth'],
      ['usb', 'cable'],
      ['power', 'bank'],
      ['hard', 'drive'],
      ['flash', 'drive'],
      ['memory', 'card']
    ];
    
    for (const [word1, word2] of compoundTerms) {
      if (productNameLower.includes(word1) && productNameLower.includes(word2)) {
        // If both words are found, prioritize the first one for image matching
        if (productImageMap[word1]) {
          console.log(`Product "${productName}" matched with compound term: ${word1} + ${word2}`);
          return productImageMap[word1];
        }
      }
    }
    
    // Try to match product name with image categories - check for the longest matching word first
    const matchingCategories = Object.keys(productImageMap).filter(category => 
      productNameLower.includes(category)
    ).sort((a, b) => b.length - a.length); // Sort by length descending
    
    const matchedCategory = matchingCategories.length > 0 ? matchingCategories[0] : null;
    
    if (matchedCategory) {
      console.log(`Product "${productName}" matched with category: ${matchedCategory}`);
    } else {
      console.log(`Product "${productName}" had no category match, using default image`);
    }
    
    // Return the matched category image or a default image
    return matchedCategory 
      ? productImageMap[matchedCategory] 
      : productImageMap['cloth']; // Changed default to cloth since we're troubleshooting that case
  };

  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success' | 'info' | 'warning'
  });
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; // 9 cards per page (3 rows of 3 cards)

  // Preload images for faster display
  useEffect(() => {
    // Preload all product images
    Object.values(productImageMap).forEach(imageUrl => {
      const img = new Image();
      img.src = imageUrl;
    });
  }, []);

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        // Fetch categories
        const categoriesResponse = await fetchCategoriesApi();
        console.log('Categories response:', categoriesResponse);
        
        if (categoriesResponse && categoriesResponse.statusCode === 200 && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch all products initially
        const productsResponse = await showInventory();
        console.log('Products response:', productsResponse);
        
        // Handle different response structures
        if (productsResponse) {
          let productsData;
          
          // Check if the response has a data property that contains the products array
          if (productsResponse.data && Array.isArray(productsResponse.data)) {
            productsData = productsResponse.data;
          } 
          // Check if the response itself is the products array
          else if (Array.isArray(productsResponse)) {
            productsData = productsResponse;
          }
          // Check if response has a nested data property
          else if (productsResponse.data && productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
            productsData = productsResponse.data.data;
          }
          
          if (productsData) {
            // Add relevant product images based on product name
            const productsWithImages = productsData.map((product: Product, index: number) => {
              // Find a relevant image based on product name
              let imageUrl = product.imageUrl;
              
              if (!imageUrl) {
                console.log(`Finding image match for product: "${product.name}"`);
                imageUrl = findBestImageMatch(product.name);
              }
              
              return {
                ...product,
                imageUrl,
                stockQuantity: product.stockQuantity || Math.floor(Math.random() * 50) // Add random stock if not provided
              };
            });
            setProducts(productsWithImages);
            
            // Calculate total pages
            setTotalPages(Math.ceil(productsWithImages.length / itemsPerPage));
            // Reset to page 1 when data changes
            setPage(1);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Failed to load inventory data');
        showMessage(error.message || 'Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();  
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId: number | string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null); // Reset error state
    
    try {
      const response = await showInventory(categoryId);
      console.log('Category filtered products response:', response);
      
      // Handle different response structures
      if (response) {
        let productsData;
        
        // Check if the response has a data property that contains the products array
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data;
        } 
        // Check if the response itself is the products array
        else if (Array.isArray(response)) {
          productsData = response;
        }
        // Check if response has a nested data property
        else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        }
        
        if (productsData) {
          // Add relevant product images based on product name
          const productsWithImages = productsData.map((product: Product, index: number) => {
            // Find a relevant image based on product name
            let imageUrl = product.imageUrl;
            
            if (!imageUrl) {
              console.log(`Finding image match for product: "${product.name}"`);
              imageUrl = findBestImageMatch(product.name);
            }
            
            return {
              ...product,
              imageUrl,
              stockQuantity: product.stockQuantity || Math.floor(Math.random() * 50) // Add random stock if not provided
            };
          });
          setProducts(productsWithImages);
          
          // Calculate total pages
          setTotalPages(Math.ceil(productsWithImages.length / itemsPerPage));
          // Reset to page 1 when category changes
          setPage(1);
        } else {
          // If no products found, set empty array
          setProducts([]);
          setTotalPages(1);
          setPage(1);
        }
      }
    } catch (error: any) {
      console.error('Error fetching products by category:', error);
      setProducts([]); // Set empty array on error
      setError('Failed to load products for this category');
      showMessage(error.message || 'Failed to load products for this category');
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to book order form
  const handleAddToShop = (product: Product) => {
    // Navigate to SimpleBookOrder component with product data
    navigate('/book-order', { 
      state: { 
        selectedProduct: product,
        fromOrderItems: true
      } 
    });
  };
  
  // Show snackbar message
  const showMessage = (message: string, severity: 'error' | 'success' | 'info' | 'warning' = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, backgroundColor: '#f8f9fa' }}>
      {/* Modern Dashboard Header Section */}
      <Paper 
        elevation={0} 
        className="dashboard-header"
        sx={{
          borderRadius: '16px',
          mb: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 50%, #FFCC70 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          position: 'relative'
        }}
      >
        <Box className="header-pattern"></Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'translate(30%, -30%)'
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'translate(-30%, 30%)'
          }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between',
          p: { xs: 3, md: 4 },
          position: 'relative',
          zIndex: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 0 } }}>
            <Box sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: '16px', 
              p: 1.5,
              mr: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <StorefrontIcon sx={{ fontSize: 38, color: 'white' }} />
            </Box>
            <Box>
              <Typography className="header-title" sx={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800, 
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
                letterSpacing: '-0.5px',
                position: 'relative',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                lineHeight: 1.2
              }}>
                Product Catalog
              </Typography>
              <Typography className="header-subtitle" sx={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '1.1rem',
                color: 'white',
                opacity: 0.9,
                mt: 1,
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                Browse our premium collection and add products to your order
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Badge 
                badgeContent={products.length} 
                color="error" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    backgroundColor: '#FF9A8B',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  } 
                }}
              >
                <Inventory2Icon sx={{ color: 'white', mr: 1, fontSize: '1.3rem' }} />
              </Badge>
              <Typography sx={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white'
              }}>
                Products Available
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '12px',
                padding: '10px 20px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              View Cart
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dashboard Controls with Glass Morphism */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        mb: 4,
        gap: 2
      }}>
        {/* Category Filter */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: '16px',
            flex: 1,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="category-select-label">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                Filter by Category
              </Box>
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#C850C0' 
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4158D0'
                }
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AllInboxIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#4158D0' }} />
                  <em>All Categories</em>
                </Box>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FolderIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#C850C0' }} />
                    {category.categoryName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        
        {/* Search Box with Glass Morphism */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: '16px',
            flex: 2,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <SearchIcon sx={{ color: '#C850C0', mr: 1.5, fontSize: '1.3rem' }} />
          <InputBase
            placeholder="Search products by name, SKU or description..."
            fullWidth
            sx={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.95rem',
              '& input': {
                padding: '4px 0'
              }
            }}
          />
        </Paper>
      </Box>

        {/* Products Grid with Modern Design */}
        {error && !loading ? (
          // Error state with modern design
          <Paper 
            elevation={0} 
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              backgroundColor: 'rgba(255, 97, 97, 0.03)',
              border: '1px dashed #ff6161',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(255, 97, 97, 0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <Box sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto',
              backgroundColor: 'rgba(255, 97, 97, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              <ErrorOutlineIcon sx={{ fontSize: 60, color: '#ff6161' }} />
            </Box>
            <Typography sx={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#212121',
              mt: 2
            }}>
              Something went wrong
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '1rem',
              color: '#666',
              mt: 1,
              mb: 4,
              maxWidth: '500px',
              margin: '10px auto 32px'
            }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              disableElevation
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ 
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                borderRadius: '50px',
                textTransform: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                padding: '10px 32px',
                boxShadow: '0 10px 20px rgba(200, 80, 192, 0.3)',
                '&:hover': {
                  boxShadow: '0 15px 25px rgba(200, 80, 192, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Try Again
            </Button>
          </Paper>
        ) : loading ? (
          // Loading skeleton with modern design
          <Box sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography sx={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600, 
                fontSize: '1.2rem',
                color: '#212121'
              }}>
                <Skeleton variant="text" width={200} animation="wave" sx={{ borderRadius: '8px' }} />
              </Typography>
              <Skeleton variant="rectangular" width={120} height={40} animation="wave" sx={{ borderRadius: '50px' }} />
            </Box>
            
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Paper elevation={0} sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    height: '100%',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)'
                    }
                  }}>
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" height={28} width="90%" animation="wave" sx={{ borderRadius: '4px' }} />
                      <Skeleton variant="text" height={20} width="60%" animation="wave" sx={{ mt: 1, borderRadius: '4px' }} />
                      <Skeleton variant="text" height={32} width="40%" animation="wave" sx={{ mt: 2, borderRadius: '4px' }} />
                      <Skeleton variant="text" height={18} width="30%" animation="wave" sx={{ mt: 1, borderRadius: '4px' }} />
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Skeleton variant="rectangular" height={44} width="100%" animation="wave" sx={{ borderRadius: '8px' }} />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : products.length > 0 ? (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography sx={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 700, 
                fontSize: '1.3rem',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <LocalOfferIcon sx={{ mr: 1.5, color: '#C850C0' }} />
                Featured Products
                {selectedCategory !== '' && (
                  <Chip 
                    label={categories.find(c => c.id === selectedCategory)?.categoryName || 'Category'} 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      backgroundColor: 'rgba(65, 88, 208, 0.1)', 
                      color: '#4158D0',
                      fontWeight: 600,
                      borderRadius: '50px',
                      '& .MuiChip-deleteIcon': {
                        color: '#4158D0'
                      }
                    }}
                    onDelete={() => handleCategoryChange('')}
                  />
                )}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontSize: '0.9rem',
                  color: '#666',
                  mr: 2
                }}>
                  Page {page} of {totalPages}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              {getCurrentPageItems().map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Paper 
                    elevation={0} 
                    className="product-card-modern"
                    sx={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      height: '100%',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      backgroundColor: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)'
                      }
                    }}
                  >
                    <Box 
                      className="product-image-container-modern"
                      sx={{
                        height: '220px',
                        position: 'relative',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        overflow: 'hidden'
                      }}
                    >
                      {product.stockQuantity && product.stockQuantity > 0 ? (
                        <Chip 
                          label={`In Stock: ${product.stockQuantity}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'rgba(65, 88, 208, 0.1)',
                            color: '#4158D0',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            zIndex: 2,
                            borderRadius: '50px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          icon={<VerifiedIcon style={{ fontSize: '0.9rem', color: '#4158D0' }} />}
                        />
                      ) : (
                        <Chip 
                          label="Out of Stock"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'rgba(255, 97, 97, 0.1)',
                            color: '#ff6161',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            zIndex: 2,
                            borderRadius: '50px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                      
                      <CardMedia
                        component="img"
                        className="product-image-modern"
                        image={product.imageUrl}
                        alt={product.name}
                        loading="eager"
                        sx={{ 
                          maxHeight: '180px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.08)'
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Typography 
                        sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          color: '#333',
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minHeight: '2.8rem'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '0.85rem',
                          color: '#666',
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          SKU: {product.sku}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 700,
                          fontSize: '1.4rem',
                          color: '#4158D0',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: product.stockQuantity && product.stockQuantity > 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 97, 97, 0.1)',
                          padding: '4px 10px',
                          borderRadius: '50px'
                        }}>
                          <CircleIcon sx={{ 
                            fontSize: 8, 
                            mr: 0.5,
                            color: product.stockQuantity && product.stockQuantity > 0 ? '#2ecc71' : '#ff6161'
                          }} />
                          <Typography component="span" sx={{ 
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: product.stockQuantity && product.stockQuantity > 0 ? '#2ecc71' : '#ff6161'
                          }}>
                            {product.stockQuantity && product.stockQuantity > 0 ? 'Available' : 'Unavailable'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          disableElevation
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToShop(product)}
                          sx={{
                            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            padding: '10px',
                            boxShadow: '0 4px 15px rgba(65, 88, 208, 0.3)',
                            '&:hover': {
                              boxShadow: '0 8px 25px rgba(65, 88, 208, 0.4)',
                            },
                            '&.Mui-disabled': {
                              background: '#e0e0e0',
                              color: '#a0a0a0'
                            }
                          }}
                        >
                          Add to Order
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 5,
                  py: 2.5,
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    disabled={page === 1}
                    onClick={() => handlePageChange(null, 1)}
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1,
                      color: page === 1 ? '#bdbdbd' : '#4158D0',
                      mr: 1
                    }}
                  >
                    <FirstPageIcon fontSize="small" />
                  </Button>
                  
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size="large"
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: '#333',
                        margin: '0 2px'
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%) !important',
                        color: 'white !important',
                        boxShadow: '0 4px 10px rgba(65, 88, 208, 0.3)'
                      },
                      '& .MuiPaginationItem-page': {
                        borderRadius: '8px',
                        margin: '0 4px'
                      }
                    }}
                  />
                  
                  <Button 
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(null, totalPages)}
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1,
                      color: page === totalPages ? '#bdbdbd' : '#4158D0',
                      ml: 1
                    }}
                  >
                    <LastPageIcon fontSize="small" />
                  </Button>
                </Box>
              </Paper>
            )}
          </>
        ) : (
          <Paper elevation={0} sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: 'rgba(65, 88, 208, 0.02)',
            border: '1px dashed rgba(65, 88, 208, 0.2)',
            borderRadius: '16px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(65, 88, 208, 0.05)'
          }}>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto',
              backgroundColor: 'rgba(65, 88, 208, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              <SearchIcon sx={{ fontSize: 60, color: '#4158D0' }} />
            </Box>
            <Typography sx={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#333',
              mt: 2
            }}>
              No Products Found
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '1rem',
              color: '#666',
              mt: 1,
              mb: 4,
              maxWidth: '500px',
              margin: '10px auto 32px'
            }}>
              We couldn't find any products matching your criteria. Try selecting a different category or check back later.
            </Typography>
            <Button 
              variant="contained" 
              disableElevation
              onClick={() => handleCategoryChange('')}
              sx={{ 
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                borderRadius: '50px',
                textTransform: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                padding: '10px 32px',
                boxShadow: '0 10px 20px rgba(65, 88, 208, 0.3)',
                '&:hover': {
                  boxShadow: '0 15px 25px rgba(65, 88, 208, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              View All Products
            </Button>
          </Paper>
        )}
        
      {/* Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderItems;