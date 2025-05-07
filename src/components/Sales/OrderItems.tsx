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
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={1} 
        className="header-section"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StorefrontIcon sx={{ fontSize: 28, mr: 1.5 }} />
            <Box>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 600, 
                fontSize: '1.5rem',
                letterSpacing: '-0.5px'
              }}>
                Product Catalog
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Browse products and add to your order
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: 'rgba(255,255,255,0.15)',
          padding: '6px 12px',
          borderRadius: '4px'
        }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem' }}>
            {products.length} Products Available
          </Typography>
        </Box>
      </Paper>

      <Box>
        {/* Category Filter */}
        <Box className="category-filter">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label">Filter by Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Products Grid */}
        {error && !loading ? (
          // Error state - Flipkart style
          <Paper 
            elevation={0} 
            sx={{ 
              textAlign: 'center', 
              py: 6, 
              backgroundColor: 'transparent',
              border: '1px dashed #ff6161',
              borderRadius: '2px'
            }}
          >
            <Box sx={{ 
              width: 180, 
              height: 180, 
              margin: '0 auto', 
              backgroundImage: 'url(https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-500_cd3e64.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }} />
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: '1.2rem',
              fontWeight: 500,
              color: '#212121',
              mt: 2
            }}>
              Something went wrong
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: '0.9rem',
              color: '#878787',
              mt: 1,
              mb: 3
            }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              disableElevation
              onClick={() => window.location.reload()}
              sx={{ 
                backgroundColor: '#2874f0',
                borderRadius: '2px',
                textTransform: 'none',
                fontFamily: 'Roboto, sans-serif',
                padding: '8px 24px'
              }}
            >
              Retry
            </Button>
          </Paper>
        ) : loading ? (
          // Loading skeleton - Flipkart style
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={item}>
                <Card sx={{ 
                  borderRadius: '2px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: '100%'
                }}>
                  <Skeleton variant="rectangular" height={240} animation="wave" />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" height={20} width="90%" animation="wave" />
                    <Skeleton variant="text" height={20} width="60%" animation="wave" sx={{ mt: 0.5 }} />
                    <Skeleton variant="text" height={24} width="40%" animation="wave" sx={{ mt: 1.5 }} />
                    <Skeleton variant="text" height={16} width="30%" animation="wave" sx={{ mt: 0.5 }} />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Skeleton variant="rectangular" height={36} width="50%" animation="wave" sx={{ borderRadius: 0.5 }} />
                      <Skeleton variant="rectangular" height={36} width="50%" animation="wave" sx={{ borderRadius: 0.5 }} />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : products.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {getCurrentPageItems().map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card className="product-card">
                    <Box className="product-image-container">
                      <CardMedia
                        component="img"
                        className="product-image"
                        image={product.imageUrl}
                        alt={product.name}
                        loading="eager"
                        sx={{ 
                          height: '180px',
                          objectFit: 'contain'
                        }}
                      />
                      <Box className="card-overlay" />
                    </Box>
                    
                    <Box className="card-content-area">
                      <Typography className="product-title" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      
                      <Box className="sku-label" sx={{ color: '#878787', fontSize: '0.8rem', mt: 0.5 }}>
                        <Typography component="span" sx={{ color: '#878787', fontSize: '0.8rem' }}>
                          SKU: {product.sku}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1.5 }}>
                        <Typography className="price-tag" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                        
                        {product.stockQuantity && (
                          <Box 
                            className={`stock-indicator ${
                              product.stockQuantity > 20 ? 'in-stock' : 
                              product.stockQuantity > 5 ? 'low-stock' : 
                              'out-of-stock'
                            }`}
                            sx={{ mt: 0.5 }}
                          >
                            {product.stockQuantity > 0 ? (
                              <>
                                <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} />
                                {product.stockQuantity} in stock
                              </>
                            ) : (
                              <>
                                <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} />
                                Out of stock
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                    
                    <Box className="card-footer">
                      <Button 
                        variant="contained" 
                        fullWidth
                        disableElevation
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToShop(product)}
                        className="add-to-shop-button"
                      >
                        ADD TO ORDER
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  size="medium"
                  siblingCount={0}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.9rem',
                      color: '#212121'
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#2874f0 !important',
                      color: 'white !important'
                    },
                    '& .MuiPaginationItem-page': {
                      border: '1px solid #e0e0e0',
                      borderRadius: '2px',
                      margin: '0 4px'
                    }
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Paper elevation={0} sx={{ 
            textAlign: 'center', 
            py: 6, 
            backgroundColor: 'transparent',
            border: '1px dashed #e0e0e0',
            borderRadius: '2px'
          }}>
            <Box sx={{ 
              width: 180, 
              height: 180, 
              margin: '0 auto', 
              backgroundImage: 'url(https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }} />
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: '1.2rem',
              fontWeight: 500,
              color: '#212121',
              mt: 2
            }}>
              No Products Found
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: '0.9rem',
              color: '#878787',
              mt: 1
            }}>
              Try selecting a different category or check back later
            </Typography>
          </Paper>
        )}
      </Box>
      
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